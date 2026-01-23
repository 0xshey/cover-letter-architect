import { ResumeInterest } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface InterestsFormProps {
	items: ResumeInterest[] | undefined;
	onChange: (items: ResumeInterest[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function InterestsForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: InterestsFormProps) {
	const handleAdd = () => {
		const newItem: ResumeInterest = {
			name: "",
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
		field: keyof ResumeInterest,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Interests"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className={cn("space-y-4", isOwner && "space-y-6")}>
					<div className="space-y-1">
						<ResumeField
							label="Interest"
							value={item.name || ""}
							onChange={(v) => handleUpdate(index, "name", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Interest Name"
						/>
					</div>
					<div className="space-y-1">
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
							placeholder="Keyword 1, Keyword 2"
						/>
					</div>
				</div>
			)}
		/>
	);
}
