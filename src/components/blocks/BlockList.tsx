"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

export function BlockList() {
	const { blocks, addBlock } = useAppStore();
	const [isAdding, setIsAdding] = useState(false);

	// New Block State
	const [newCategory, setNewCategory] = useState<BlockCategory>("Experience");
	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");

	const handleAdd = () => {
		if (!newTitle || !newContent) return;
		addBlock({
			category: newCategory,
			title: newTitle,
			content: newContent,
		});
		setNewTitle("");
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
				<h3 className="text-sm font-medium text-muted-foreground">
					My Blocks
				</h3>
				<Dialog open={isAdding} onOpenChange={setIsAdding}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-8 w-8 p-0 rounded-full"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Block</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label>Category</Label>
								<div className="flex flex-wrap gap-2">
									{CATEGORIES.map((cat) => (
										<button
											key={cat}
											onClick={() => setNewCategory(cat)}
											className={`px-3 py-1 rounded-full text-xs border transition-colors ${
												newCategory === cat
													? "bg-primary text-primary-foreground border-primary"
													: "bg-background hover:bg-muted"
											}`}
										>
											{cat}
										</button>
									))}
								</div>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="new-title">Title / Role</Label>
								<Input
									id="new-title"
									placeholder="e.g. Senior Frontend Dev @ Google"
									value={newTitle}
									onChange={(e) =>
										setNewTitle(e.target.value)
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="new-content">Content</Label>
								<Textarea
									id="new-content"
									placeholder="Describe your experience, skills, or motivation..."
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
								disabled={!newTitle || !newContent}
							>
								Add Block
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="space-y-3">
				{sortedBlocks.length === 0 ? (
					<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
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
