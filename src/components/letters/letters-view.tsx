"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTargetStore } from "@/store/useTargetStore";
import { useContentStore } from "@/store/useContentStore";
import { useEditorStore } from "@/store/useEditorStore";
import { GridItem } from "./grid-item";
import { ListItem } from "./list-item";
import { LettersToolbar } from "./letters-toolbar";
import { CoverLetter } from "./types";
import { Plus } from "lucide-react";
import { NewLetterButton } from "@/components/dashboard/new-letter-button";

interface LettersViewProps {
	initialCoverLetters: CoverLetter[];
}

export function LettersView({ initialCoverLetters }: LettersViewProps) {
	const router = useRouter();
	const { setTargetInfo } = useTargetStore();
	const { setBlocks } = useContentStore();
	const { setCurrentLetter, setCurrentCoverLetterId } = useEditorStore();

	const [coverLetters, setCoverLetters] =
		useState<CoverLetter[]>(initialCoverLetters);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");

	// Filter letters based on search query
	const filteredLetters = useMemo(() => {
		if (!searchQuery.trim()) return coverLetters;
		const query = searchQuery.toLowerCase();
		return coverLetters.filter((cl) => {
			const company = cl.target_info?.companyName?.toLowerCase() || "";
			const role = cl.target_info?.roleTitle?.toLowerCase() || "";
			return company.includes(query) || role.includes(query);
		});
	}, [coverLetters, searchQuery]);

	const handleDelete = async (id: string) => {
		const res = await fetch(`/api/cover-letters/${id}`, {
			method: "DELETE",
		});
		if (res.ok) {
			setCoverLetters((prev) => prev.filter((cl) => cl.id !== id));
		}
	};

	const handleLoad = async (cl: CoverLetter) => {
		router.push(`/letters/${cl.id}/editor`);
	};

	if (coverLetters.length === 0 && !searchQuery) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center bg-muted/5 animate-in fade-in-50 mt-8">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
					<Plus className="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 className="text-xl font-semibold mb-2">
					No cover letters yet
				</h3>
				<p className="text-muted-foreground max-w-sm mb-6">
					Create your first customized cover letter to get started on
					your job application journey.
				</p>
				<NewLetterButton size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Toolbar */}
			<LettersToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			{/* Content */}
			{filteredLetters.length === 0 ? (
				<div className="text-center py-12 text-muted-foreground">
					No letters found matching "{searchQuery}"
				</div>
			) : (
				<div
					className={
						viewMode === "grid"
							? "grid gap-4 grid-cols-1 md:grid-cols-2"
							: "flex flex-col gap-3"
					}
				>
					{filteredLetters.map((cl) => {
						const ItemComponent =
							viewMode === "grid" ? GridItem : ListItem;
						return (
							<ItemComponent
								key={cl.id}
								letter={cl}
								onOpen={handleLoad}
								onDelete={handleDelete}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
