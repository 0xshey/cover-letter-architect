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

			// 1. Reset everything first
			resetTargetInfo();
			resetBlocks();
			resetEditor();

			// 2. Fetch user and resume
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

					// 3. Populate Target Info (Personal Data)
					if (basics) {
						setTargetInfo({
							authorName: basics.name || "",
							email: basics.email || "",
							phone: basics.phone || "",
							portfolioUrl: basics.url || "",
							cityState:
								basics.location?.city && basics.location?.region
									? `${basics.location.city}, ${basics.location.region}`
									: basics.location?.city || "",
						});
					}

					// 4. Populate Blocks
					const newBlocks: ContentBlock[] = [];

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
											"\n- "
									  )}`
									: null,
							]
								.filter(Boolean)
								.join("\n");

							newBlocks.push({
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
											"\n- "
									  )}`
									: null,
								p.url ? `URL: ${p.url}` : null,
							]
								.filter(Boolean)
								.join("\n");

							newBlocks.push({
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

							newBlocks.push({
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
								}`
						);
						newBlocks.push({
							id: crypto.randomUUID(),
							category: "Skills",
							content: skillLines.join("\n"),
							isEnabled: true,
						});
					}

					if (newBlocks.length > 0) {
						setBlocks(newBlocks);
					}
				}
			}

			router.push("/editor");
		} catch (error) {
			console.error("Error populating from resume:", error);
			// Fallback to empty editor even if fetch fails
			router.push("/editor");
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
