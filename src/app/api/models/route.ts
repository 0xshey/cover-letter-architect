import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.accessToken) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const response = await fetch(
			"https://generativelanguage.googleapis.com/v1beta/models",
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
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
			.sort((a: any, b: any) => b.id.localeCompare(a.id)); // Newer versions usually higher?

		return NextResponse.json({ models });
	} catch (error) {
		console.error("Error in models route:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
