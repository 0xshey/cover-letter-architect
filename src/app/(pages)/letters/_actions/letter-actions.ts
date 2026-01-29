"use server";

import { createClient } from "@/lib/supabase/server";
import { ResumeRow } from "@/types/resume";
import { ContentBlock, TargetInfo } from "@/types";
import { redirect } from "next/navigation";

export async function createAndPrepopulateLetter() {
	const supabase = await createClient();

	// 1. Authenticate User
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	// 2. Fetch Resume
	const { data: resume } = await supabase
		.from("resumes")
		.select("*")
		.eq("user_id", user.id)
		.maybeSingle<ResumeRow>();

	// 3. Prepare Data
	let dbTargetInfo: Partial<TargetInfo> = {};
	let dbBlocks: ContentBlock[] = [];

	if (resume && resume.data) {
		const r = resume.data;
		const basics = r.basics;

		// Populate Target Info
		if (basics) {
			dbTargetInfo = {
				authorName: basics.name || "",
				email: basics.email || "",
				phone: basics.phone || "",
				portfolioUrl: basics.url || "",
				cityState:
					basics.location?.city && basics.location?.region
						? `${basics.location.city}, ${basics.location.region}`
						: basics.location?.city || "",
			};
		}

		// Populate Blocks
		// Work Experience
		if (r.work && r.work.length > 0) {
			r.work.forEach((w) => {
				const lines = [
					w.position && w.name
						? `${w.position} at ${w.name}`
						: w.position || w.name,
					w.startDate && w.endDate
						? `${w.startDate} - ${w.endDate}`
						: null,
					w.summary,
					w.highlights && w.highlights.length > 0
						? `Highlights:\n- ${w.highlights.join("\n- ")}`
						: null,
				]
					.filter(Boolean)
					.join("\n");

				dbBlocks.push({
					id: crypto.randomUUID(),
					category: "Experience",
					content: lines,
					isEnabled: true,
				});
			});
		}

		// Projects
		if (r.projects && r.projects.length > 0) {
			r.projects.forEach((p) => {
				const lines = [
					p.name,
					p.description,
					p.highlights && p.highlights.length > 0
						? `Highlights:\n- ${p.highlights.join("\n- ")}`
						: null,
					p.url ? `URL: ${p.url}` : null,
				]
					.filter(Boolean)
					.join("\n");

				dbBlocks.push({
					id: crypto.randomUUID(),
					category: "Projects",
					content: lines,
					isEnabled: true,
				});
			});
		}

		// Education
		if (r.education && r.education.length > 0) {
			r.education.forEach((edu) => {
				const lines = [
					edu.institution,
					edu.area
						? `${edu.studyType || "Degree"} in ${edu.area}`
						: edu.studyType,
					edu.startDate && edu.endDate
						? `${edu.startDate} - ${edu.endDate}`
						: null,
				]
					.filter(Boolean)
					.join("\n");

				dbBlocks.push({
					id: crypto.randomUUID(),
					category: "Education",
					content: lines,
					isEnabled: true,
				});
			});
		}

		// Skills
		if (r.skills && r.skills.length > 0) {
			const skillLines = r.skills.map(
				(s) => `${s.name}: ${s.keywords ? s.keywords.join(", ") : ""}`,
			);
			dbBlocks.push({
				id: crypto.randomUUID(),
				category: "Skills",
				content: skillLines.join("\n"),
				isEnabled: true,
			});
		}
	}

	// 4. Insert Letter
	const { data: newLetter, error } = await supabase
		.from("cover_letters")
		.insert({
			user_id: user.id,
			blocks: dbBlocks,
			target_info: dbTargetInfo,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Supabase Error:", error);
		throw new Error(
			`Failed to create cover letter: ${error.message} (Code: ${error.code}) - ${error.details || error.hint || ""}`,
		);
	}

	// 5. Redirect (automatically throws NEXT_REDIRECT error caught by Next.js)
	redirect(`/letters/${newLetter.id}/editor`);
}
