"use client";

import { useState } from "react";
import { Plus, Info, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { BlockCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { BlockItem } from "./BlockItem";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Note: We'll implement a simple select using native select for simplicity since we didn't add Select primitive yet
// or we can just use buttons for categories.

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

export function BlockList() {
	const { blocks, addBlock } = useAppStore();
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

	// Group blocks by category for display? Or just list them?
	// User asked for "multi-section form". But maybe a flat list with filters or headings is better for the sidebar.
	// Let's do a simple list sorted by category order for now.

	const sortedBlocks = [...blocks].sort((a, b) => {
		return CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category);
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-xs font-medium text-muted-foreground">
					My Blocks
				</h3>
				<Dialog open={isAdding} onOpenChange={setIsAdding}>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 rounded-full"
						>
							<Plus className="h-4 w-4 text-muted-foreground" />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<div className="grid gap-6">
							<h3 className="text-md">New Block</h3>
							<div className="grid gap-2">
								<Label>Category</Label>
								<div className="flex flex-wrap gap-2">
									{CATEGORIES.map((cat) => (
										<button
											key={cat}
											onClick={() => setNewCategory(cat)}
											className={`px-2 py-1 rounded text-xs font-medium text-muted-foreground transition-colors ${
												newCategory === cat
													? "bg-primary text-primary-foreground"
													: "bg-muted hover:bg-muted-foreground/20"
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
									<div className="relative bg-muted/50 rounded-md p-3 pr-8 text-xs text-muted-foreground border border-border">
										<p>{CATEGORY_PROMPTS[newCategory]}</p>
										<button
											onClick={() => setShowPrompt(false)}
											className="absolute top-1 right-1 p-1 hover:bg-muted rounded-full transition-colors"
											title="Dismiss"
										>
											<X className="h-3.5 w-3.5" />
										</button>
									</div>
								)}

								<Textarea
									id="new-content"
									placeholder={CATEGORY_PROMPTS[newCategory]}
									className="min-h-[150px]"
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

			<div className="space-y-3">
				{sortedBlocks.length === 0 ? (
					<div className="rounded-lg border border-border border-dashed p-8 text-center text-sm text-muted-foreground">
						No blocks yet. Click + to add one.
					</div>
				) : (
					sortedBlocks.map((block) => (
						<BlockItem key={block.id} block={block} />
					))
				)}
			</div>
		</div>
	);
}
