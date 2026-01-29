"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTargetStore } from "@/store/useTargetStore";
import { useContentStore } from "@/store/useContentStore";
import { useEditorStore } from "@/store/useEditorStore";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createAndPrepopulateLetter } from "@/app/(pages)/letters/_actions/letter-actions";

export function NewLetterButton({
	size = "sm",
	className,
}: {
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}) {
	const { resetTargetInfo } = useTargetStore();
	const { resetBlocks } = useContentStore();
	const { resetEditor } = useEditorStore();
	const [isLoading, setIsLoading] = useState(false);

	const handleNew = async () => {
		try {
			setIsLoading(true);

			// 1. Reset client stores immediately for better UX
			resetTargetInfo();
			resetBlocks();
			resetEditor();

			// 2. Call Server Action
			// This action handles auth check, DB fetching, insertion, and redirect.
			await createAndPrepopulateLetter();
		} catch (error) {
			console.error("Error creating new letter:", error);
			if (error instanceof Error) {
				toast.error(error.message, {
					action: {
						label: "Copy Error",
						onClick: () =>
							navigator.clipboard.writeText(error.message),
					},
				});
			} else {
				toast.error("Failed to create new letter");
			}
			setIsLoading(false); // Only stop loading on error, as success redirects
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
