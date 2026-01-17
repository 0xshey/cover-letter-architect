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
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			throw error;
		}

		return NextResponse.json({ coverLetter: data });
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
		const { title, target_info, blocks } = body;

		const { data, error } = await supabase
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

		if (error) {
			throw error;
		}

		return NextResponse.json({ coverLetter: data });
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
