import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContentBlock, TargetInfo } from "@/types";

interface GenerateRequest {
	blocks: ContentBlock[];
	targetInfo: TargetInfo;
	model?: string;
}

const SYSTEM_PROMPT = `
# ROLE
You are a Professional Career Editor. Your task is to ASSEMBLE a cover letter using only the provided snippets. You act as a bridge between raw user notes and a polished professional document.

# INPUT DATA
- TARGET ROLE: [Insert Job Title]
- TARGET COMPANY: [Insert Company Name]
- JOB DESCRIPTION CONTEXT: [Insert Key Skills/Requirements from Job Post]
- USER DATA BLOCKS: [Dynamic Block Content]

# MANDATORY CONSTRAINTS
1. ZERO HALLUCINATION: You are strictly forbidden from inventing facts. Do not add years of experience, specific tool proficiencies, or previous employers NOT in the snippets.
2. TONE MIRRORING: Analyze the user's writing style in the snippets. Match this vocabulary and sentence structure. If the user is brief, keep the letter punchy.
3. REMOVE "AI-ISMS": Avoid generic filler phrases like "In today's competitive landscape," "A testament to my dedication," or "I am the ideal candidate."
4. NO FLOWERY LANGUAGE: Do not use over-the-top adjectives like "passionate," "transformative," or "innovative" unless the user used them.
5. MISSING DATA: If a snippet is empty, do not mention that category. Do not create "placeholder" text.

# OUTPUT STRUCTURE
- **Opening**: Identify the role and a specific reason for interest drawn from the "Motivation" snippet.
- **Body Paragraphs**: Synthesize "Experience," "Projects," and "Skills." Focus on the "how" and "why" provided by the user.
- **Cultural Fit**: Use "Personal" and "Motivation" snippets to show alignment.
- **Closing**: State expectations (from "Expectations") and a call to action.

**CRITICAL**: DO NOT generate the Header, Date, Greeting, or Sign-off. These are handled by the system. Return *only* the body paragraphs.

# FINAL CHECK
Before outputting, ensure the letter sounds like a human wrote it. It should be authentic, grounded in fact, and free of corporate cliches.

RETURN JSON format with "markdown" key containing the text.
`;

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

		const userContent = `
TARGET ROLE: ${targetInfo.roleTitle}
TARGET COMPANY: ${targetInfo.companyName}
JOB DESCRIPTION CONTEXT: ${
			targetInfo.jobId ? `Job ID: ${targetInfo.jobId}` : "N/A"
		}

USER DATA BLOCKS:
${blocks.map((b) => `- ${b.category}: ${b.content}`).join("\n")}
    `.trim();

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
