"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
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
	const { resetEditorState } = useAppStore();

	const handleNew = () => {
		resetEditorState();
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
