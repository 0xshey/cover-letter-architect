import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
	try {
		const supabase = await createClient();
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Fetch user's cover letters
		const { data, error } = await supabase
			.from("cover_letters")
			.select("*")
			.order("updated_at", { ascending: false });

		if (error) {
			throw error;
		}

		return NextResponse.json({ coverLetters: data });
	} catch (error: unknown) {
		console.error("Fetch cover letters error:", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { title, target_info, blocks, markdown, latex } = body;

		if (!title || !target_info || !blocks) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Insert new cover letter
		const { data: coverLetter, error: clError } = await supabase
			.from("cover_letters")
			.insert({
				user_id: session.user.id,
				title,
				target_info,
				blocks,
			})
			.select()
			.single();

		if (clError) {
			throw clError;
		}

		// Insert initial generation if content is provided
		if (markdown) {
			const { error: genError } = await supabase
				.from("generations")
				.insert({
					cover_letter_id: coverLetter.id,
					markdown,
					latex,
					description: "Initial Save",
				});

			if (genError) {
				console.error("Failed to save initial generation:", genError);
				// We don't fail the whole request, but log it
			}
		}

		return NextResponse.json({ coverLetter });
	} catch (error: unknown) {
		console.error("Save cover letter error:", error);
		const message =
			error instanceof Error ? error.message : "Failed to save";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
