import { ResumeProject } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

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
				<div className={cn("space-y-4", isOwner && "space-y-6")}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ResumeField
							label="Project Name"
							value={item.name || ""}
							onChange={(v) => handleUpdate(index, "name", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Project Name"
						/>
						<ResumeField
							label="URL"
							value={item.url || ""}
							onChange={(v) => handleUpdate(index, "url", v)}
							isOwner={isOwner}
							placeholder="https://project.com"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

					<ResumeField
						label="Description"
						value={item.description || ""}
						onChange={(v) => handleUpdate(index, "description", v)}
						isOwner={isOwner}
						variant="textarea"
						placeholder="Project description..."
					/>
				</div>
			)}
		/>
	);
}
