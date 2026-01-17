import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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

		const { data, error } = await supabase
			.from("cover_letters")
			.select("*, generations(markdown, latex, created_at)")
			.eq("id", id)
			.single();

		if (error) {
			throw error;
		}

		// Sort generations to find the latest one (client-side sort for safety)
		const generations = (data.generations as any[]) || [];
		generations.sort(
			(a, b) =>
				new Date(b.created_at).getTime() -
				new Date(a.created_at).getTime()
		);
		const latest = generations[0];

		const responsePayload = {
			...data,
			markdown: latest?.markdown || null,
			latex: latest?.latex || null,
			generations: undefined, // Remove generic array to clean up
		};

		return NextResponse.json({ coverLetter: responsePayload });
	} catch (error: unknown) {
		console.error("Fetch cover letter error:", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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

		const body = await request.json();
		const { title, target_info, blocks, markdown, latex } = body;

		const { data: coverLetter, error: clError } = await supabase
			.from("cover_letters")
			.update({
				title,
				target_info,
				blocks,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id)
			.select()
			.single();

		if (clError) {
			throw clError;
		}

		if (markdown) {
			// Insert new generation
			const { error: genError } = await supabase
				.from("generations")
				.insert({
					cover_letter_id: id,
					markdown,
					latex,
					description: "Update",
				});

			if (genError) {
				console.error("Failed to save generation:", genError);
			}

			// Prune old generations (keep latest 10)
			const { data: latestGenerations } = await supabase
				.from("generations")
				.select("id")
				.eq("cover_letter_id", id)
				.order("created_at", { ascending: false })
				.limit(10);

			if (latestGenerations && latestGenerations.length > 0) {
				const keepIds = latestGenerations.map((g) => g.id);
				await supabase
					.from("generations")
					.delete()
					.eq("cover_letter_id", id)
					.not("id", "in", `(${keepIds})`); // Supabase filter syntax for list
			}
		}

		return NextResponse.json({ coverLetter });
	} catch (error: unknown) {
		console.error("Update cover letter error:", error);
		const message =
			error instanceof Error ? error.message : "Failed to update";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
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

		const { error } = await supabase
			.from("cover_letters")
			.delete()
			.eq("id", id);

		if (error) {
			throw error;
		}

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error("Delete cover letter error:", error);
		const message =
			error instanceof Error ? error.message : "Failed to delete";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
