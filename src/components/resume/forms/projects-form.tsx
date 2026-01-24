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
				<div className="grid grid-cols-3">
					<div className="col-span-1 flex gap-4">
						<ResumeField
							label="Start Date"
							value={item.startDate || ""}
							onChange={(v) => {
								if (v === "" || /^\d{0,4}$/.test(v)) {
									handleUpdate(index, "startDate", v);
								}
							}}
							isOwner={isOwner}
							placeholder="YYYY"
							InputClassName="w-24 text-center"
						/>
						<ResumeField
							label="End Date"
							value={item.endDate || ""}
							onChange={(v) => {
								if (
									v === "" ||
									/^\d{0,4}$/.test(v) ||
									/^p(r(e(s(e(n(t)?)?)?)?)?)?$/i.test(v)
								) {
									const lower = v.toLowerCase();
									if (lower === "present") {
										handleUpdate(
											index,
											"endDate",
											"Present"
										);
									} else {
										handleUpdate(index, "endDate", v);
									}
								}
							}}
							isOwner={isOwner}
							placeholder="YYYY / Present"
							InputClassName="w-32 text-center"
						/>
					</div>

					<div
						className={cn(
							"col-span-2 flex flex-col",
							isOwner && "gap-6"
						)}
					>
						<ResumeField
							label="Project Name"
							value={item.name || ""}
							onChange={(v) => handleUpdate(index, "name", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Project Name"
							InputClassName="font-bold"
						/>
						<ResumeField
							label="URL"
							value={item.url || ""}
							onChange={(v) => handleUpdate(index, "url", v)}
							isOwner={isOwner}
							placeholder="https://project.com"
						/>
						<ResumeField
							label="Description"
							value={item.description || ""}
							onChange={(v) =>
								handleUpdate(index, "description", v)
							}
							isOwner={isOwner}
							variant="textarea"
							placeholder="Project description..."
							InputClassName="min-h-[150px]"
						/>
					</div>
				</div>
			)}
		/>
	);
}
