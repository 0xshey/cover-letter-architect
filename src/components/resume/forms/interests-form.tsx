"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInterest } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface InterestsFormProps {
	items: ResumeInterest[] | undefined;
	onChange: (items: ResumeInterest[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function InterestsForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: InterestsFormProps) {
	const handleAdd = () => {
		const newItem: ResumeInterest = {
			name: "",
			keywords: [],
		};
		onChange([...(items || []), newItem]);
	};

	const handleRemove = (index: number) => {
		if (!items) return;
		const newItems = [...items];
		newItems.splice(index, 1);
		onChange(newItems);
	};

	const handleUpdate = (
		index: number,
		field: keyof ResumeInterest,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Interests"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground uppercase tracking-wider">
							Interest
						</Label>
						<Input
							value={item.name || ""}
							onChange={(e) =>
								handleUpdate(index, "name", e.target.value)
							}
							variant="ghost"
							className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
							placeholder="Interest Name"
							disabled={!isOwner}
						/>
					</div>
					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground uppercase tracking-wider">
							Keywords (comma separated)
						</Label>
						<Textarea
							value={item.keywords?.join(", ") || ""}
							onChange={(e) => {
								const keywords = e.target.value
									.split(",")
									.map((k) => k.trim())
									.filter((k) => k);
								handleUpdate(index, "keywords", keywords);
							}}
							className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[60px] px-0"
							placeholder="Keyword 1, Keyword 2"
							disabled={!isOwner}
						/>
					</div>
				</div>
			)}
		/>
	);
}
