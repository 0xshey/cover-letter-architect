"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArrayFormSectionProps<T> {
	title: string;
	items: T[] | undefined;
	addItem: () => void;
	removeItem: (index: number) => void;
	renderItem: (item: T, index: number) => React.ReactNode;
	isOwner: boolean; // This effectively means "isEditing" in the current context
	emptyMessage?: string;
	description?: string;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function ArrayFormSection<T>({
	title,
	items,
	addItem,
	removeItem,
	renderItem,
	isOwner,
	emptyMessage = "No items added yet.",
	description,
	isVisible = true,
	onToggleVisibility,
}: ArrayFormSectionProps<T>) {
	// If not owner (editing) and hidden, don't show at all
	if (!isOwner && !isVisible) {
		return null;
	}

	return (
		<section
			className={cn(
				"w-full bg-muted/30 p-2 rounded-xl border space-y-6 transition-all",
				!isVisible && "opacity-50 grayscale border-dashed"
			)}
		>
			<div className="flex items-center justify-between">
				<div className="ml-2">
					<div className="flex items-center gap-2">
						<h2 className="text-lg font-semibold tracking-tight">
							{title}
						</h2>
						{isOwner && onToggleVisibility && (
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 text-muted-foreground hover:text-foreground"
								onClick={() => onToggleVisibility(!isVisible)}
								title={
									isVisible ? "Hide section" : "Show section"
								}
							>
								{isVisible ? (
									<Eye className="h-4 w-4" />
								) : (
									<EyeOff className="h-4 w-4" />
								)}
							</Button>
						)}
					</div>
					{description && (
						<p className="text-sm text-muted-foreground mt-1">
							{description}
						</p>
					)}
				</div>
				{isOwner && (
					<Button variant="outline" size="sm" onClick={addItem}>
						<Plus className="h-4 w-4 mr-2" />
						Add
					</Button>
				)}
			</div>

			<div className="space-y-8">
				{items?.map((item, index) => (
					<div
						key={index}
						className="relative group space-y-4 border-b last:border-0 pb-8 last:pb-0"
					>
						{isOwner && (
							<Button
								variant="ghost"
								size="icon"
								className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 z-10"
								onClick={() => removeItem(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
						{renderItem(item, index)}
					</div>
				))}

				{(!items || items.length === 0) && (
					<div className="text-center py-8 text-muted-foreground italic">
						{emptyMessage}
					</div>
				)}
			</div>
		</section>
	);
}
