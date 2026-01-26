import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTargetStore } from "@/store/useTargetStore";
import { useContentStore } from "@/store/useContentStore";
import { useEditorStore } from "@/store/useEditorStore";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ResumeRow } from "@/types/resume";
import { ContentBlock } from "@/types";

export function NewLetterButton({
	size = "sm",
	className,
}: {
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}) {
	const router = useRouter();
	const { resetTargetInfo, setTargetInfo } = useTargetStore();
	const { resetBlocks, setBlocks } = useContentStore();
	const { resetEditor } = useEditorStore();
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClient();

	const handleNew = async () => {
		try {
			setIsLoading(true);

			// 1. Reset client stores
			resetTargetInfo();
			resetBlocks();
			resetEditor();

			// Prepare data for DB
			let dbTargetInfo: Record<string, any> = {};
			let dbBlocks: ContentBlock[] = [];

			// 2. Fetch user and resume to populate initial data
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				const { data: resume } = await supabase
					.from("resumes")
					.select("*")
					.eq("user_id", user.id)
					.maybeSingle<ResumeRow>();

				if (resume && resume.data) {
					const r = resume.data;
					const basics = r.basics;

					// 3. Populate Target Info
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
						setTargetInfo(dbTargetInfo); // Update client store
					}

					// 4. Populate Blocks
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
									? `Highlights:\n- ${w.highlights.join(
											"\n- ",
										)}`
									: null,
							]
								.filter(Boolean)
								.join("\n");

							dbBlocks.push({
								id: crypto.randomUUID(),
								category: "Experience",
								content: lines,
								isEnabled: true, // Default to true or false? Maybe true so they are available.
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
									? `Highlights:\n- ${p.highlights.join(
											"\n- ",
										)}`
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
									? `${edu.studyType || "Degree"} in ${
											edu.area
										}`
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
							(s) =>
								`${s.name}: ${
									s.keywords ? s.keywords.join(", ") : ""
								}`,
						);
						dbBlocks.push({
							id: crypto.randomUUID(),
							category: "Skills",
							content: skillLines.join("\n"),
							isEnabled: true,
						});
					}

					if (dbBlocks.length > 0) {
						setBlocks(dbBlocks); // Update client store
					}
				}
			}

			// Insert new cover letter
			const { data: newLetter, error } = await supabase
				.from("cover_letters")
				.insert({
					user_id: user?.id,
					blocks: dbBlocks,
					target_info: dbTargetInfo,
					markdown: "",
					title: "Untitled Cover Letter",
				})
				.select()
				.single();

			if (error) throw error;

			if (newLetter) {
				router.push(`/letters/${newLetter.id}/editor`);
			}
		} catch (error) {
			console.error("Error creating new letter:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleNew}
			size={size}
			className={className}
			disabled={isLoading}
		>
			{isLoading ? (
				<Loader2
					className={
						size === "lg"
							? "h-6 w-6 animate-spin"
							: "mr-2 h-5 w-5 animate-spin"
					}
				/>
			) : (
				<Plus className={size === "lg" ? "h-6 w-6" : "mr-2 h-5 w-5"} />
			)}
			{size !== "icon" &&
				(size === "lg" ? "Create First Letter" : "New Letter")}
		</Button>
	);
}
