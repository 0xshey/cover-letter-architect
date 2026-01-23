import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeRow, Profile } from "@/types/resume";
import { ResumeForm } from "@/components/resume/resume-form";

export default async function ResumePage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const supabase = await createClient();

	const {
		data: { user: currentUser },
	} = await supabase.auth.getUser();

	// 1. Fetch Profile to get User ID
	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("username", username)
		.single<Profile>();

	if (!profile) {
		notFound();
	}

	// 2. Fetch Resume by User ID
	const { data: resume } = await supabase
		.from("resumes")
		.select("*")
		.eq("user_id", profile.id) // profile.id is the auth user id
		.single<ResumeRow>();

	return (
		<div className="w-full h-full flex flex-col gap-8 p-8 max-w-4xl mx-auto mt-20">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl font-bold tracking-tighter">
					{profile.full_name || profile.username}'s Resume
				</h1>
			</div>

			{resume ? (
				<ResumeForm
					initialData={resume.data}
					resumeId={resume.id}
					isOwner={currentUser?.id === profile.id}
				/>
			) : (
				<div className="p-4 border border-dashed rounded-lg text-muted-foreground">
					No resume found for this user.
				</div>
			)}
		</div>
	);
}
