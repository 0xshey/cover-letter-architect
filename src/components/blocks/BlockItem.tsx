"use client";

import { useState } from "react";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { BlockCategory, ContentBlock } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BlockItemProps {
	block: ContentBlock;
}

export function BlockItem({ block }: BlockItemProps) {
	const { toggleBlock, removeBlock, updateBlock } = useAppStore();
	const [isEditing, setIsEditing] = useState(false);

	// Local edit state
	const [title, setTitle] = useState(block.title);
	const [content, setContent] = useState(block.content);

	const handleUpdate = () => {
		updateBlock(block.id, { title, content });
		setIsEditing(false);
	};

	// Categories color coding
	const categoryColors: Record<BlockCategory, string> = {
		Education:
			"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
		Experience:
			"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
		Projects:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
		Skills: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
		Motivation:
			"bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
		Expectations:
			"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
		Personal:
			"bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
	};

	return (
		<>
			<div
				className={cn(
					"group relative flex flex-col gap-2 rounded-lg border p-3 shadow-sm transition-all hover:shadow-md",
					!block.isEnabled && "opacity-60 bg-muted/20"
				)}
			>
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-2">
						<GripVertical className="h-4 w-4 text-muted-foreground/30 cursor-move" />
						<span
							className={cn(
								"text-xs px-2 py-0.5 rounded-full font-medium",
								categoryColors[block.category]
							)}
						>
							{block.category}
						</span>
					</div>
					<Switch
						checked={block.isEnabled}
						onCheckedChange={() => toggleBlock(block.id)}
					/>
				</div>

				<div>
					<h4 className="font-medium text-sm leading-none">
						{block.title}
					</h4>
					<p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
						{block.content}
					</p>
				</div>

				<div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={() => setIsEditing(true)}
					>
						<Pencil className="h-3.5 w-3.5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-destructive hover:text-destructive"
						onClick={() => removeBlock(block.id)}
					>
						<Trash2 className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Block</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<Label htmlFor="title">Title / Role</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								className="min-h-[150px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdate}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
