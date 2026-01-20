"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CoverLetterCard } from "@/components/cards/CoverLetterCard";
import { Loader2, Plus } from "lucide-react";

interface CoverLetter {
	id: string;
	title: string;
	updated_at: string;
	target_info: any;
	blocks: any;
	markdown?: string; // Optional field if available in DB
}

export function DashboardClient() {
	const router = useRouter();
	const {
		setTargetInfo,
		setBlocks,
		setCurrentLetter,
		setCurrentCoverLetterId,
		resetEditorState,
	} = useAppStore();

	const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const fetchCoverLetters = async () => {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("cover_letters")
				.select("*")
				.order("updated_at", { ascending: false });

			if (!error && data) {
				setCoverLetters(data);
			}
			setIsLoading(false);
		};

		fetchCoverLetters();
	}, [supabase]);

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

	const handleNew = () => {
		resetEditorState();
		router.push("/editor");
	};

	const getPreviewText = (cl: CoverLetter) => {
		if (cl.markdown) return cl.markdown;
		if (Array.isArray(cl.blocks)) {
			// Attempt to find the first meaningful text block
			// Assuming blocks might have 'content' or similar
			const textBlocks = cl.blocks
				.filter((b: any) => b.content && typeof b.content === "string")
				.map((b: any) => b.content)
				.join(" ");
			if (textBlocks) return textBlocks;
		}
		return "No preview content available.";
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						My Cover Letters
					</h1>
					<p className="text-muted-foreground text-md">
						Manage your saved letters and tailored applications.
					</p>
				</div>
				<Button onClick={handleNew} size="sm" className="shadow-sm">
					<Plus className="mr-2 h-5 w-5" /> New Letter
				</Button>
			</div>

			{coverLetters.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center bg-muted/5 animate-in fade-in-50">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
						<Plus className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="text-xl font-semibold mb-2">
						No cover letters yet
					</h3>
					<p className="text-muted-foreground max-w-sm mb-6">
						Create your first customized cover letter to get started
						on your job application journey.
					</p>
					<Button onClick={handleNew} size="lg">
						Create First Letter
					</Button>
				</div>
			) : (
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
			)}
		</div>
	);
}
