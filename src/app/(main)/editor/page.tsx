"use client";

import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { Workspace } from "@/components/layouts/workspace";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function EditorPage() {
	const { activeMobileView } = useAppStore();

	return (
		<main className="h-screen w-full overflow-hidden bg-background">
			<div
				className={cn(
					"flex h-full w-[200%] md:w-full transition-transform duration-300 ease-in-out md:transform-none",
					activeMobileView === "workspace"
						? "-translate-x-1/2 md:translate-x-0"
						: "translate-x-0"
				)}
			>
				<EditorSidebar className="w-1/2 md:w-[400px] flex-shrink-0 border-r" />
				<Workspace className="w-1/2 md:flex-1 min-w-0 max-w-4xl mx-auto" />
			</div>
		</main>
	);
}
