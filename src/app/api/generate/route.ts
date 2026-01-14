import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContentBlock, TargetInfo } from "@/types";

interface GenerateRequest {
	blocks: ContentBlock[];
	targetInfo: TargetInfo;
	apiKey?: string;
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
		const {
			blocks,
			targetInfo,
			apiKey: userApiKey,
			model: selectedModel,
		} = (await req.json()) as GenerateRequest;

		const apiKey = userApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{
					error: "API Key is missing. Please provide one in Settings or set GOOGLE_GENERATIVE_AI_API_KEY env var.",
				},
				{ status: 400 }
			);
		}

		if (!blocks || blocks.length === 0) {
			return NextResponse.json(
				{ error: "No content blocks provided" },
				{ status: 400 }
			);
		}

		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({
			model: selectedModel || "gemini-1.5-flash",
			generationConfig: {
				responseMimeType: "application/json",
			},
		});

		const userContent = `
    Target Company: ${targetInfo.companyName}
    Target Role: ${targetInfo.roleTitle}
    Addressee: ${targetInfo.addressee || "Hiring Manager"}

    Content Blocks (Enabled):
    ${blocks
		.map((b) => `[${b.category}] ${b.title}: ${b.content}`)
		.join("\n\n")}

    Please write the cover letter now.
    `;

		const result = await model.generateContent({
			contents: [
				{
					role: "user",
					parts: [{ text: SYSTEM_PROMPT + "\n\n" + userContent }],
				},
			],
		});

		const response = result.response;
		const text = response.text();

		// Parse JSON response safely
		try {
			const jsonResponse = JSON.parse(text);
			return NextResponse.json(jsonResponse);
		} catch (e) {
			console.error("Failed to parse JSON from AI response:", text);
			// Fallback if model didn't return perfect JSON (though gemini-1.5-flash is good at this with mimeType set)
			return NextResponse.json({ markdown: text, rawText: text });
		}
	} catch (error: any) {
		console.error("Generation error:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to generate cover letter" },
			{ status: 500 }
		);
	}
}
