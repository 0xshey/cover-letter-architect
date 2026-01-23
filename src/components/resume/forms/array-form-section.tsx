"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormSection } from "./form-section";

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
	const addElement = isOwner ? (
		<Button variant="outline" size="sm" onClick={addItem}>
			<Plus className="h-4 w-4 mr-2" />
			Add
		</Button>
	) : null;

	return (
		<FormSection
			title={title}
			description={description}
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			rightElement={addElement}
			className="" // Slightly reduced padding on mobile, standard on desktop if needed, or just p-6
		>
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
					<div className="text-center py-4 text-muted-foreground italic">
						{emptyMessage}
					</div>
				)}
			</div>
		</FormSection>
	);
}
