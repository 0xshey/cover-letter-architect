"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ArrayFormSectionProps<T> {
	title: string;
	items: T[] | undefined;
	addItem: () => void;
	removeItem: (index: number) => void;
	renderItem: (item: T, index: number) => React.ReactNode;
	isOwner: boolean;
	emptyMessage?: string;
	description?: string;
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
}: ArrayFormSectionProps<T>) {
	return (
		<section className="w-full bg-muted/30 p-2 rounded-xl border space-y-6">
			<div className="flex items-center justify-between">
				<div className="ml-2">
					<h2 className="text-lg font-semibold tracking-tight">
						{title}
					</h2>
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
