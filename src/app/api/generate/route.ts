import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContentBlock, TargetInfo } from "@/types";
import { SYSTEM_PROMPT, constructUserContent } from "@/lib/prompts";

interface GenerateRequest {
	blocks: ContentBlock[];
	targetInfo: TargetInfo;
	model?: string;
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
				{ status: 401 }
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
				{ status: 400 }
			);
		}

		// Allow any model selected by the user, defaulting to 1.5-flash if missing
		const model = selectedModel || "gemini-1.5-flash";

		const userContent = constructUserContent(targetInfo, blocks);

		console.log("Calling Gemini API with model:", model);
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

		const geminiResponse = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.provider_token}`,
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
					"Your Google session has expired. Please Sign Out and Sign In again in Settings."
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
