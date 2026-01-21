"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { CoverLetterCard } from "@/components/cards/cover-letter-card";
import { Plus } from "lucide-react";
import { NewLetterButton } from "./new-letter-button";

export interface CoverLetter {
	id: string;
	title: string;
	updated_at: string;
	target_info: any;
	blocks: any;
	markdown?: string;
}

interface DashboardGridProps {
	initialCoverLetters: CoverLetter[];
}

export function DashboardGrid({ initialCoverLetters }: DashboardGridProps) {
	const router = useRouter();
	const {
		setTargetInfo,
		setBlocks,
		setCurrentLetter,
		setCurrentCoverLetterId,
	} = useAppStore();

	const [coverLetters, setCoverLetters] =
		useState<CoverLetter[]>(initialCoverLetters);

	const handleDelete = async (id: string) => {
		const res = await fetch(`/api/cover-letters/${id}`, {
			method: "DELETE",
		});
		if (res.ok) {
			setCoverLetters((prev) => prev.filter((cl) => cl.id !== id));
		}
	};

	const handleLoad = async (cl: CoverLetter) => {
		try {
			// Optimistically set metadata
			setTargetInfo(cl.target_info);
			setBlocks(cl.blocks);
			setCurrentCoverLetterId(cl.id);

			// Fetch full content (including latest generation)
			const res = await fetch(`/api/cover-letters/${cl.id}`);
			if (res.ok) {
				const { coverLetter } = await res.json();
				setCurrentLetter(coverLetter.markdown || null);
			}

			router.push("/editor");
		} catch (error) {
			console.error("Failed to load cover letter details", error);
		}
	};

	const getPreviewText = (cl: CoverLetter) => {
		if (cl.markdown) return cl.markdown;
		if (Array.isArray(cl.blocks)) {
			const textBlocks = cl.blocks
				.filter((b: any) => b.content && typeof b.content === "string")
				.map((b: any) => b.content)
				.join(" ");
			if (textBlocks) return textBlocks;
		}
		return "No preview content available.";
	};

	if (coverLetters.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center bg-muted/5 animate-in fade-in-50">
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
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
			{coverLetters.map((cl) => (
				<CoverLetterCard
					key={cl.id}
					companyName={cl.target_info?.companyName}
					roleTitle={cl.target_info?.roleTitle}
					snippet={getPreviewText(cl)}
					updatedAt={cl.updated_at}
					onOpen={() => handleLoad(cl)}
					onDelete={() => handleDelete(cl.id)}
				/>
			))}
		</div>
	);
}
