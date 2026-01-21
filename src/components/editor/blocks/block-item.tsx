"use client";

import { useState } from "react";
import { Pencil, Trash2, GripVertical, Info, X } from "lucide-react";
import { useContentStore } from "@/store/useContentStore";
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
	const { toggleBlock, removeBlock, updateBlock } = useContentStore();
	const [isEditing, setIsEditing] = useState(false);

	// Local edit state
	const [content, setContent] = useState(block.content);
	const [showPrompt, setShowPrompt] = useState(true);

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

	const handleUpdate = () => {
		updateBlock(block.id, { content });
		setIsEditing(false);
	};

	const categoryColors: Record<BlockCategory, string> = {
		Education: "bg-badge-edu-bg text-badge-edu-fg",
		Experience: "bg-badge-exp-bg text-badge-exp-fg",
		Projects: "bg-badge-proj-bg text-badge-proj-fg",
		Skills: "bg-badge-skill-bg text-badge-skill-fg",
		Motivation: "bg-badge-mot-bg text-badge-mot-fg",
		Expectations: "bg-badge-expct-bg text-badge-expct-fg",
		Personal: "bg-badge-pers-bg text-badge-pers-fg",
	};

	return (
		<>
			<div
				className={cn(
					"group relative flex flex-col gap-0 border border-transparent p-1 transition-all bg-muted rounded-xl",
					!block.isEnabled && "opacity-60 bg-muted/20"
				)}
			>
				<div className="h-8 flex items-center justify-between gap-2 px-1">
					<div className="flex h-full items-center gap-2">
						<span
							className={cn(
								"text-xs px-2 py-0.5 rounded-md font-medium",
								categoryColors[block.category]
							)}
						>
							{block.category}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
							onClick={() => setIsEditing(true)}
						>
							<Pencil className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-destructive hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
							onClick={() => removeBlock(block.id)}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
						<Switch
							checked={block.isEnabled}
							onCheckedChange={() => toggleBlock(block.id)}
							className="ml-2"
						/>
					</div>
				</div>

				<div>
					<p className="text-xs leading-relaxed line-clamp-3 p-1">
						{block.content}
					</p>
				</div>
			</div>

			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit {block.category} Block</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="content">Content</Label>
								{!showPrompt && !!content && (
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5"
										onClick={() => setShowPrompt(true)}
										title="Show guide"
									>
										<Info className="h-3.5 w-3.5 text-muted-foreground" />
									</Button>
								)}
							</div>

							{showPrompt && !!content && (
								<div className="relative bg-muted/50 rounded-md p-3 pr-8 text-xs text-muted-foreground border border-border">
									<p>{CATEGORY_PROMPTS[block.category]}</p>
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-1 right-1 h-5 w-5"
										onClick={() => setShowPrompt(false)}
										title="Dismiss"
									>
										<X className="h-3.5 w-3.5" />
									</Button>
								</div>
							)}

							<Textarea
								id="content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								className="min-h-[150px]"
								placeholder={CATEGORY_PROMPTS[block.category]}
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
