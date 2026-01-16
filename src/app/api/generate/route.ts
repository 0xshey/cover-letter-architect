import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ContentBlock, TargetInfo } from "@/types";

interface GenerateRequest {
	blocks: ContentBlock[];
	targetInfo: TargetInfo;
	model?: string;
}

const SYSTEM_PROMPT = `
You are an expert Resume and Cover Letter Writer, known for crafting compelling, personalized narratives.
Your task is to assemble a professional cover letter based on a set of "Content Blocks" provided by the user.

Instructions:
1. Analyze the provided Content Blocks. Use the user's actual tone, vocabulary, and phrasing found in these blocks.
2. If the user's blocks are informal, be informal. If they are academic, be academic. Do NOT force "corporate speak" if it doesn't match the input.
3. Structure the letter for the specific Role and Company provided.
4. You MUST use the content from the blocks. Do not invent completely new experiences, but you can smooth out transitions.
5. CRITICAL: Whenever you use a sentence or significant phrase directly from the provided Content Blocks, wrap it in <mark> tags. Example: "I am <mark>experienced in React and Node.js</mark>."
6. Return the response in a JSON structure with "markdown" (the full letter with mark tags) and "rawText" (plain text without mark tags).
7. The output markdown should be clean and ready to render.
`;

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.accessToken) {
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

		const userContent = `
    Target Company: ${targetInfo.companyName}
    Target Role: ${targetInfo.roleTitle}
    Addressee: ${targetInfo.addressee || "Hiring Manager"}

    My Information (For Header/Signature):
    Name: ${targetInfo.authorName || "[Your Name]"}
    Email: ${targetInfo.isEmailEnabled !== false ? targetInfo.email || "" : ""}
    Phone: ${targetInfo.isPhoneEnabled !== false ? targetInfo.phone || "" : ""}
    Location: ${
		targetInfo.isCityStateEnabled !== false
			? targetInfo.cityState || ""
			: ""
	}
    Portfolio/Link: ${
		targetInfo.isPortfolioUrlEnabled !== false
			? targetInfo.portfolioUrl || ""
			: ""
	}

    Content Blocks (Enabled):
    ${blocks.map((b) => `[${b.category}]: ${b.content}`).join("\n\n")}

    Please write the cover letter now. Ensure you include a professional header with my contact info if provided.
    `;

		console.log("Calling Gemini API with model:", model);
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

		console.log("Calling Gemini API with model:", model);

		const geminiResponse = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.accessToken}`,
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
