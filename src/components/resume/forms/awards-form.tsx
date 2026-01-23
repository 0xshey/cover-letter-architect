"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeAward } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface AwardsFormProps {
	items: ResumeAward[] | undefined;
	onChange: (items: ResumeAward[]) => void;
	isOwner: boolean;
}

export function AwardsForm({ items, onChange, isOwner }: AwardsFormProps) {
	const handleAdd = () => {
		const newItem: ResumeAward = {
			title: "",
			date: "",
			awarder: "",
			summary: "",
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
		field: keyof ResumeAward,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Awards"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Title
							</Label>
							<Input
								value={item.title || ""}
								onChange={(e) =>
									handleUpdate(index, "title", e.target.value)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Award Title"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Awarder
							</Label>
							<Input
								value={item.awarder || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"awarder",
										e.target.value
									)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Organization"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Date
							</Label>
							<Input
								value={item.date || ""}
								onChange={(e) =>
									handleUpdate(index, "date", e.target.value)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="YYYY-MM-DD"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground uppercase tracking-wider">
							Summary
						</Label>
						<Textarea
							value={item.summary || ""}
							onChange={(e) =>
								handleUpdate(index, "summary", e.target.value)
							}
							className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[60px] px-0"
							placeholder="Description..."
							disabled={!isOwner}
						/>
					</div>
				</div>
			)}
		/>
	);
}
