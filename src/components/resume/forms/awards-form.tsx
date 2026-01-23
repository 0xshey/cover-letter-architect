import { ResumeAward } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface AwardsFormProps {
	items: ResumeAward[] | undefined;
	onChange: (items: ResumeAward[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function AwardsForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: AwardsFormProps) {
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
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className={cn("space-y-4", isOwner && "space-y-6")}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ResumeField
							label="Title"
							value={item.title || ""}
							onChange={(v) => handleUpdate(index, "title", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Award Title"
						/>
						<ResumeField
							label="Awarder"
							value={item.awarder || ""}
							onChange={(v) => handleUpdate(index, "awarder", v)}
							isOwner={isOwner}
							placeholder="Organization"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ResumeField
							label="Date"
							value={item.date || ""}
							onChange={(v) => handleUpdate(index, "date", v)}
							isOwner={isOwner}
							placeholder="YYYY-MM-DD"
						/>
					</div>

					<ResumeField
						label="Summary"
						value={item.summary || ""}
						onChange={(v) => handleUpdate(index, "summary", v)}
						isOwner={isOwner}
						variant="textarea"
						placeholder="Description..."
					/>
				</div>
			)}
		/>
	);
}
