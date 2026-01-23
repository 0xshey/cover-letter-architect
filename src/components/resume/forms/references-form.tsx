import { ResumeReference } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface ReferencesFormProps {
	items: ResumeReference[] | undefined;
	onChange: (items: ResumeReference[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function ReferencesForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: ReferencesFormProps) {
	const handleAdd = () => {
		const newItem: ResumeReference = {
			name: "",
			reference: "",
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
		field: keyof ResumeReference,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="References"
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
							label="Name"
							value={item.name || ""}
							onChange={(v) => handleUpdate(index, "name", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Reference Name"
						/>
					</div>
					<div className="space-y-1">
						<ResumeField
							label="Reference"
							value={item.reference || ""}
							onChange={(v) =>
								handleUpdate(index, "reference", v)
							}
							isOwner={isOwner}
							variant="textarea"
							placeholder="Reference text..."
						/>
					</div>
				</div>
			)}
		/>
	);
}
