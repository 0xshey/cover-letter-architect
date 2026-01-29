import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContentBlock, TargetInfo } from "@/types";
import { SYSTEM_PROMPT, constructUserContent } from "@/lib/prompts";

interface GenerateRequest {
	blocks: ContentBlock[];
	targetInfo: TargetInfo;
	model?: string;
}

// Helper to refresh Google Access Token
async function refreshGoogleToken(refreshToken: string) {
	try {
		console.log("Refreshing Google Access Token...");
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: process.env.GOOGLE_CLIENT_ID!,
				client_secret: process.env.GOOGLE_CLIENT_SECRET!,
				refresh_token: refreshToken,
				grant_type: "refresh_token",
			}),
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(
				data.error_description || "Failed to refresh token",
			);
		}

		return data.access_token as string;
	} catch (error) {
		console.error("Token refresh failed:", error);
		return null;
	}
}

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session || !session.provider_token) {
			return NextResponse.json(
				{ error: "Unauthorized. Please sign in with Google." },
				{ status: 401 },
			);
		}

		const {
			blocks,
			targetInfo,
			model: selectedModel,
		} = (await req.json()) as GenerateRequest;

		if (!blocks || blocks.length === 0) {
			return NextResponse.json(
				{ error: "No content blocks provided" },
				{ status: 400 },
			);
		}

		// Allow any model selected by the user, defaulting to 1.5-flash if missing
		const model = selectedModel || "gemini-1.5-flash";

		const userContent = constructUserContent(targetInfo, blocks);

		console.log("Calling Gemini API with model:", model);
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

		let token = session.provider_token;
		let geminiResponse = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				contents: [
					{
						role: "user",
						parts: [{ text: SYSTEM_PROMPT + "\n\n" + userContent }],
					},
				],
				generationConfig: {
					responseMimeType: "application/json",
				},
			}),
		});

		if (geminiResponse.status === 401) {
			console.log("Access token expired. Attempting to refresh...");

			if (session.provider_refresh_token) {
				const newToken = await refreshGoogleToken(
					session.provider_refresh_token,
				);
				if (newToken) {
					console.log(
						"Token refreshed successfully. Retrying request...",
					);
					token = newToken;
					// Retry the request with new token
					geminiResponse = await fetch(url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							contents: [
								{
									role: "user",
									parts: [
										{
											text:
												SYSTEM_PROMPT +
												"\n\n" +
												userContent,
										},
									],
								},
							],
							generationConfig: {
								responseMimeType: "application/json",
							},
						}),
					});
				} else {
					console.error("Failed to obtain new access token.");
				}
			} else {
				console.warn("No refresh token available in session.");
			}
		}

		if (!geminiResponse.ok) {
			const errorData = await geminiResponse.json();
			console.error("Gemini API Error:", errorData);

			const errorMessage =
				errorData.error?.message ||
				`Gemini API request failed: ${geminiResponse.statusText}`;

			if (
				geminiResponse.status === 401 ||
				errorMessage.includes("invalid authentication credentials")
			) {
				throw new Error(
					"Your Google session has expired. Please Sign Out and Sign In again in Settings to enable persistent sessions.",
				);
			}

			throw new Error(errorMessage);
		}

		const data = await geminiResponse.json();
		// Gemini REST API response structure: candidates[0].content.parts[0].text
		const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

		if (!text) {
			throw new Error("Empty response from AI");
		}

		// Parse JSON response safely
		try {
			const jsonResponse = JSON.parse(text);
			return NextResponse.json(jsonResponse);
		} catch {
			console.error("Failed to parse JSON from AI response:", text);
			return NextResponse.json({ markdown: text, rawText: text });
		}
	} catch (error: unknown) {
		console.error("Generation error:", error);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to generate cover letter";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
