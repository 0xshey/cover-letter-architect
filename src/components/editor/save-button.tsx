"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";
import { useTargetStore } from "@/store/useTargetStore";
import { useEditorStore } from "@/store/useEditorStore";
import { generateLatexCode } from "@/lib/latex-generator";
import { toast } from "sonner";

export function SaveButton({ className }: { className?: string }) {
	const { session } = useAuthStore();
	const { blocks } = useContentStore();
	const { targetInfo } = useTargetStore();
	const { currentLetter, currentCoverLetterId, setCurrentCoverLetterId } =
		useEditorStore();

	const [isSaving, setIsSaving] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	const handleSave = async () => {
		if (!session) {
			toast.error("You must be logged in to save.");
			return;
		}

		setIsSaving(true);

		const title = targetInfo.roleTitle
			? `${targetInfo.roleTitle} at ${targetInfo.companyName}`
			: targetInfo.companyName || "Untitled Cover Letter";

		const payload = {
			title,
			target_info: targetInfo,
			blocks,
			markdown: currentLetter,
			latex: currentLetter
				? generateLatexCode(targetInfo, currentLetter)
				: null,
		};

		try {
			const url = currentCoverLetterId
				? `/api/cover-letters/${currentCoverLetterId}`
				: "/api/cover-letters";

			const method = currentCoverLetterId ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				const data = await res.json();
				if (data.coverLetter) {
					setCurrentCoverLetterId(data.coverLetter.id);
					setIsSaved(true);
					toast.success("Cover letter saved successfully.");
					setTimeout(() => setIsSaved(false), 3000);
				}
			} else {
				const err = await res.json();
				throw new Error(err.error || "Failed to save");
			}
		} catch (error) {
			console.error("Save failed", error);
			toast.error("Failed to save cover letter.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Button
			variant={isSaved ? "outline" : "default"}
			size="sm"
			onClick={handleSave}
			disabled={!session || isSaving || isSaved}
			className={cn(
				"min-w-[100px] transition-all",
				isSaved &&
					"text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700",
				className,
			)}
		>
			{isSaving ? (
				<Loader2 className="h-4 w-4 mr-2 animate-spin" />
			) : isSaved ? (
				<Check className="h-4 w-4 mr-2" />
			) : (
				<Save className="h-4 w-4 mr-2" />
			)}
			{isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
		</Button>
	);
}
