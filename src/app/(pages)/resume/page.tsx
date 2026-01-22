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

	redirect(`/resume/${user.id}`);
}
