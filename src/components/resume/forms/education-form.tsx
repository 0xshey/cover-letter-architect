import { ResumeEducation } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface EducationFormProps {
	items: ResumeEducation[] | undefined;
	onChange: (items: ResumeEducation[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function EducationForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
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
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className={cn("space-y-4", isOwner && "space-y-6")}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ResumeField
							label="Institution"
							value={item.institution || ""}
							onChange={(v) =>
								handleUpdate(index, "institution", v)
							}
							isOwner={isOwner}
							variant="primary"
							placeholder="University / School"
						/>
						<ResumeField
							label="Area of Study"
							value={item.area || ""}
							onChange={(v) => handleUpdate(index, "area", v)}
							isOwner={isOwner}
							placeholder="Major / Field"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ResumeField
							label="Degree"
							value={item.studyType || ""}
							onChange={(v) =>
								handleUpdate(index, "studyType", v)
							}
							isOwner={isOwner}
							placeholder="Bachelor's, Master's"
						/>
						<ResumeField
							label="Start Date"
							value={item.startDate || ""}
							onChange={(v) =>
								handleUpdate(index, "startDate", v)
							}
							isOwner={isOwner}
							placeholder="YYYY-MM"
						/>
						<ResumeField
							label="End Date"
							value={item.endDate || ""}
							onChange={(v) => handleUpdate(index, "endDate", v)}
							isOwner={isOwner}
							placeholder="YYYY-MM or Present"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ResumeField
							label="Score / GPA"
							value={item.score || ""}
							onChange={(v) => handleUpdate(index, "score", v)}
							isOwner={isOwner}
							placeholder="4.0"
						/>
						<ResumeField
							label="Website"
							value={item.url || ""}
							onChange={(v) => handleUpdate(index, "url", v)}
							isOwner={isOwner}
							placeholder="https://institution.com"
						/>
					</div>
				</div>
			)}
		/>
	);
}
