import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const {
			data: { session },
		} = await supabase.auth.getSession();
		const providerToken = session?.provider_token;

		if (!providerToken) {
			// Fallback or error if token is missing (might happen if scope wasn't requested or session refresh)
			// For public models like Gemini free tier, we might use an API Key server-side instead of user OAuth token.
			// But let's assume we want to use the user's token as before.
			return NextResponse.json(
				{ error: "Provider token not found. Please sign in again." },
				{ status: 401 }
			);
		}

		const response = await fetch(
			"https://generativelanguage.googleapis.com/v1beta/models",
			{
				headers: {
					Authorization: `Bearer ${providerToken}`,
				},
			}
		);

		if (!response.ok) {
			const err = await response.json();
			console.error("Failed to fetch models", err);
			return NextResponse.json(
				{ error: "Failed to fetch models" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		const models = (data.models || [])
			.filter((m: any) =>
				m.supportedGenerationMethods?.includes("generateContent")
			)
			.map((m: any) => ({
				id: m.name.replace("models/", ""),
				name: m.displayName,
				description: m.description,
			}))
			.sort((a: any, b: any) => b.id.localeCompare(a.id));

		return NextResponse.json({ models });
	} catch (error) {
		console.error("Error in models route:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
