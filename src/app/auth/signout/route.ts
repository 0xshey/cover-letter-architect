import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const supabase = await createClient();

	// Check if user is logged in
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		await supabase.auth.signOut();
	}

	revalidatePath("/", "layout");
	return NextResponse.redirect(new URL("/", request.url), {
		status: 302,
	});
}
