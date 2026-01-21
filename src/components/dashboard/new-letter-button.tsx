"use client";

import { Button } from "@/components/ui/button";
import { useTargetStore } from "@/store/useTargetStore";
import { useContentStore } from "@/store/useContentStore";
import { useEditorStore } from "@/store/useEditorStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewLetterButton({
	size = "sm",
	className,
}: {
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}) {
	const router = useRouter();
	const { resetTargetInfo } = useTargetStore();
	const { resetBlocks } = useContentStore();
	const { resetEditor } = useEditorStore();

	const handleNew = () => {
		resetTargetInfo();
		resetBlocks();
		resetEditor();
		router.push("/editor");
	};

	return (
		<Button onClick={handleNew} size={size} className={className}>
			<Plus className={size === "lg" ? "h-6 w-6" : "mr-2 h-5 w-5"} />
			{size !== "icon" &&
				(size === "lg" ? "Create First Letter" : "New Letter")}
		</Button>
	);
}
