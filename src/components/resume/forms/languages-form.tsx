import { ResumeLanguage } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface LanguagesFormProps {
	items: ResumeLanguage[] | undefined;
	onChange: (items: ResumeLanguage[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function LanguagesForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: LanguagesFormProps) {
	const handleAdd = () => {
		const newItem: ResumeLanguage = {
			language: "",
			fluency: "",
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
		field: keyof ResumeLanguage,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Languages"
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
							label="Language"
							value={item.language || ""}
							onChange={(v) => handleUpdate(index, "language", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="English"
						/>
						<ResumeField
							label="Fluency"
							value={item.fluency || ""}
							onChange={(v) => handleUpdate(index, "fluency", v)}
							isOwner={isOwner}
							placeholder="Native speaker"
						/>
					</div>
				</div>
			)}
		/>
	);
}
