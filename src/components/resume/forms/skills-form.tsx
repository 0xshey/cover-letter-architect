import { ResumeSkill } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface SkillsFormProps {
	items: ResumeSkill[] | undefined;
	onChange: (items: ResumeSkill[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function SkillsForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: SkillsFormProps) {
	const handleAdd = () => {
		const newItem: ResumeSkill = {
			name: "",
			level: "",
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
		field: keyof ResumeSkill,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Skills"
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
							label="Name"
							value={item.name || ""}
							onChange={(v) => handleUpdate(index, "name", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Skill Name (e.g. Web Development)"
						/>
						<ResumeField
							label="Level"
							value={item.level || ""}
							onChange={(v) => handleUpdate(index, "level", v)}
							isOwner={isOwner}
							placeholder="Master, Beginner"
						/>
					</div>

					<ResumeField
						label="Keywords (comma separated)"
						value={item.keywords?.join(", ") || ""}
						onChange={(v) => {
							const keywords = v
								.split(",")
								.map((k) => k.trim())
								.filter((k) => k);
							handleUpdate(index, "keywords", keywords);
						}}
						isOwner={isOwner}
						variant="textarea"
						placeholder="HTML, CSS, JavaScript"
					/>
				</div>
			)}
		/>
	);
}
