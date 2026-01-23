"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeEducation } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface EducationFormProps {
	items: ResumeEducation[] | undefined;
	onChange: (items: ResumeEducation[]) => void;
	isOwner: boolean;
}

export function EducationForm({
	items,
	onChange,
	isOwner,
}: EducationFormProps) {
	const handleAdd = () => {
		const newItem: ResumeEducation = {
			institution: "",
			area: "",
			studyType: "",
			startDate: "",
			endDate: "",
			score: "",
			url: "",
			courses: [],
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
		field: keyof ResumeEducation,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Education"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Institution
							</Label>
							<Input
								value={item.institution || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"institution",
										e.target.value
									)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="University / School"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Area of Study
							</Label>
							<Input
								value={item.area || ""}
								onChange={(e) =>
									handleUpdate(index, "area", e.target.value)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Major / Field"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Degree
							</Label>
							<Input
								value={item.studyType || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"studyType",
										e.target.value
									)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Bachelor's, Master's"
								disabled={!isOwner}
							/>
						</div>
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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Score / GPA
							</Label>
							<Input
								value={item.score || ""}
								onChange={(e) =>
									handleUpdate(index, "score", e.target.value)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="4.0"
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
								placeholder="https://institution.com"
								disabled={!isOwner}
							/>
						</div>
					</div>
				</div>
			)}
		/>
	);
}
