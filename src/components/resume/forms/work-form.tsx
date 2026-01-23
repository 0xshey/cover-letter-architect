"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeWork } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface WorkFormProps {
	items: ResumeWork[] | undefined;
	onChange: (items: ResumeWork[]) => void;
	isOwner: boolean;
}

export function WorkForm({ items, onChange, isOwner }: WorkFormProps) {
	const handleAdd = () => {
		const newItem: ResumeWork = {
			name: "",
			position: "",
			startDate: "",
			endDate: "",
			summary: "",
			highlights: [],
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
		field: keyof ResumeWork,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Work Experience"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Company
							</Label>
							<Input
								value={item.name || ""}
								onChange={(e) =>
									handleUpdate(index, "name", e.target.value)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Company Name"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Position
							</Label>
							<Input
								value={item.position || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"position",
										e.target.value
									)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Job Title"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Start Date
							</Label>
							<Input
								value={item.startDate || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"startDate",
										e.target.value
									)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="YYYY-MM"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								End Date
							</Label>
							<Input
								value={item.endDate || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"endDate",
										e.target.value
									)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="YYYY-MM or Present"
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
							className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[80px] px-0"
							placeholder="Describe your responsibilities and achievements..."
							disabled={!isOwner}
						/>
					</div>
					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground uppercase tracking-wider">
							Website
						</Label>
						<Input
							value={item.url || ""}
							onChange={(e) =>
								handleUpdate(index, "url", e.target.value)
							}
							variant="ghost"
							className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
							placeholder="https://company.com"
							disabled={!isOwner}
						/>
					</div>
				</div>
			)}
		/>
	);
}
