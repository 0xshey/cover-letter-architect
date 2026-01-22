import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ResumeRedirectPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: profile } = await supabase
		.from("resume_profiles")
		.select("username")
		.eq("user_id", user.id)
		.single();

	if (!profile?.username) {
		redirect("/signup");
	}

	redirect(`/resume/${profile.username}`);
}
