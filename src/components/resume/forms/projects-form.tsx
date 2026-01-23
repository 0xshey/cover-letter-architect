"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeProject } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface ProjectsFormProps {
	items: ResumeProject[] | undefined;
	onChange: (items: ResumeProject[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function ProjectsForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: ProjectsFormProps) {
	const handleAdd = () => {
		const newItem: ResumeProject = {
			name: "",
			startDate: "",
			endDate: "",
			description: "",
			highlights: [],
			url: "",
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
		field: keyof ResumeProject,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Projects"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Project Name
							</Label>
							<Input
								value={item.name || ""}
								onChange={(e) =>
									handleUpdate(index, "name", e.target.value)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Project Name"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								URL
							</Label>
							<Input
								value={item.url || ""}
								onChange={(e) =>
									handleUpdate(index, "url", e.target.value)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="https://project.com"
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
							Description
						</Label>
						<Textarea
							value={item.description || ""}
							onChange={(e) =>
								handleUpdate(
									index,
									"description",
									e.target.value
								)
							}
							className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[80px] px-0"
							placeholder="Project description..."
							disabled={!isOwner}
						/>
					</div>
				</div>
			)}
		/>
	);
}
