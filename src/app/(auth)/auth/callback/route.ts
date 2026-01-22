import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/letters";

	if (code) {
		const supabase = await createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.exchangeCodeForSession(code);

		if (!error && user) {
			// Check if user has a username
			const { data: profile } = await supabase
				.from("resume_profiles")
				.select("username")
				.eq("user_id", user.id)
				.single();

			if (!profile?.username) {
				return NextResponse.redirect(`${origin}/signup`);
			}

			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
