"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeLanguage } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";

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
						<div className="space-y-1">
							<Label className="text-muted-foreground uppercase tracking-wider">
								Language
							</Label>
							<Input
								value={item.language || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"language",
										e.target.value
									)
								}
								variant="ghost"
								className="font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="English"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-muted-foreground uppercase tracking-wider">
								Fluency
							</Label>
							<Input
								value={item.fluency || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"fluency",
										e.target.value
									)
								}
								variant="ghost"
								className="font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Native speaker"
								disabled={!isOwner}
							/>
						</div>
					</div>
				</div>
			)}
		/>
	);
}
