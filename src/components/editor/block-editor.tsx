"use client";

import { useState } from "react";
import { Plus, Info, X } from "lucide-react";
import { useContentStore } from "@/store/useContentStore";
import { BlockCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { BlockItem } from "./blocks/block-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CATEGORIES: BlockCategory[] = [
	"Education",
	"Experience",
	"Projects",
	"Skills",
	"Motivation",
	"Expectations",
	"Personal",
];

const CATEGORY_PROMPTS: Record<BlockCategory, string> = {
	Education:
		"Enter your Institution, Degree/Certificate, honors, and notable academic achievements...",
	Experience:
		"Enter the Company, Role, key responsibilities, and specific wins or impacts...",
	Projects:
		"Enter the Project Name, Tech Stack, your specific role, and outcomes or links...",
	Skills: "List your Tech Stack, soft skills, certifications, and level of expertise...",
	Motivation:
		"Explain why you want this specific role and company, and your personal connection...",
	Expectations:
		"Describe what you're looking for, salary range (optional), and potential start date...",
	Personal:
		"Share hobbies, volunteering, or interesting facts that show your personality...",
};

export function BlockEditor({ className }: { className?: string }) {
	const { blocks, addBlock } = useContentStore();
	const [isAdding, setIsAdding] = useState(false);

	// New Block State
	const [newCategory, setNewCategory] = useState<BlockCategory>("Experience");
	const [newContent, setNewContent] = useState("");
	const [showPrompt, setShowPrompt] = useState(true);

	const handleAdd = () => {
		if (!newContent) return;
		addBlock({
			category: newCategory,
			content: newContent,
		});
		setNewContent("");
		setIsAdding(false);
	};

	const sortedBlocks = [...blocks].sort((a, b) => {
		return CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category);
	});

	return (
		<div
			className={cn(
				"flex flex-col h-full bg-background border rounded-xl overflow-hidden",
				className
			)}
		>
			<div className="flex items-center justify-between p-4 border-b bg-muted/30">
				<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
					<span className="h-2 w-2 rounded-full bg-orange-500" />
					Blocks
				</h3>
				<Dialog open={isAdding} onOpenChange={setIsAdding}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-7 text-xs"
						>
							<Plus className="h-3.5 w-3.5 mr-1" /> Add Block
						</Button>
					</DialogTrigger>
					<DialogContent>
						<div className="grid gap-6">
							<h3 className="text-md font-semibold">
								Add New Block
							</h3>
							<div className="grid gap-2">
								<Label>Category</Label>
								<div className="flex flex-wrap gap-2">
									{CATEGORIES.map((cat) => (
										<button
											key={cat}
											onClick={() => setNewCategory(cat)}
											className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
												newCategory === cat
													? "bg-primary text-primary-foreground shadow-sm scale-105"
													: "bg-muted hover:bg-muted-foreground/20 text-muted-foreground"
											}`}
										>
											{cat}
										</button>
									))}
								</div>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="new-content">Content</Label>
									{!showPrompt && !!newContent && (
										<button
											onClick={() => setShowPrompt(true)}
											className="p-1 hover:bg-muted rounded-full transition-colors"
											title="Show guide"
										>
											<Info className="h-3.5 w-3.5 text-muted-foreground" />
										</button>
									)}
								</div>

								{showPrompt && !!newContent && (
									<div className="relative bg-blue-50/50 dark:bg-blue-900/10 rounded-md p-3 pr-8 text-xs text-muted-foreground border border-blue-100 dark:border-blue-900/20">
										<p>{CATEGORY_PROMPTS[newCategory]}</p>
										<button
											onClick={() => setShowPrompt(false)}
											className="absolute top-1 right-1 p-1 hover:bg-background/50 rounded-full transition-colors"
											title="Dismiss"
										>
											<X className="h-3.5 w-3.5" />
										</button>
									</div>
								)}

								<Textarea
									id="new-content"
									placeholder={CATEGORY_PROMPTS[newCategory]}
									className="min-h-[150px] resize-none"
									value={newContent}
									onChange={(e) =>
										setNewContent(e.target.value)
									}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								onClick={handleAdd}
								disabled={!newContent}
								size="sm"
							>
								Add Block
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<ScrollArea className="flex-1">
				<div className="p-4 space-y-3">
					{sortedBlocks.length === 0 ? (
						<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground bg-muted/5">
							No blocks yet. Add a block to start building your
							letter structure.
						</div>
					) : (
						sortedBlocks.map((block) => (
							<BlockItem key={block.id} block={block} />
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
