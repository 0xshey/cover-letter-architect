"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeReference } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface ReferencesFormProps {
	items: ResumeReference[] | undefined;
	onChange: (items: ResumeReference[]) => void;
	isOwner: boolean;
}

export function ReferencesForm({
	items,
	onChange,
	isOwner,
}: ReferencesFormProps) {
	const handleAdd = () => {
		const newItem: ResumeReference = {
			name: "",
			reference: "",
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
		field: keyof ResumeReference,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="References"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground uppercase tracking-wider">
							Name
						</Label>
						<Input
							value={item.name || ""}
							onChange={(e) =>
								handleUpdate(index, "name", e.target.value)
							}
							variant="ghost"
							className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
							placeholder="Reference Name"
							disabled={!isOwner}
						/>
					</div>
					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground uppercase tracking-wider">
							Reference
						</Label>
						<Textarea
							value={item.reference || ""}
							onChange={(e) =>
								handleUpdate(index, "reference", e.target.value)
							}
							className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[80px] px-0"
							placeholder="Reference text..."
							disabled={!isOwner}
						/>
					</div>
				</div>
			)}
		/>
	);
}
