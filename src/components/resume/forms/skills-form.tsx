"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeSkill } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";

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
						<div className="space-y-1">
							<Label className="text-muted-foreground uppercase tracking-wider">
								Name
							</Label>
							<Input
								value={item.name || ""}
								onChange={(e) =>
									handleUpdate(index, "name", e.target.value)
								}
								variant="ghost"
								className="font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Skill Name (e.g. Web Development)"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-muted-foreground uppercase tracking-wider">
								Level
							</Label>
							<Input
								value={item.level || ""}
								onChange={(e) =>
									handleUpdate(index, "level", e.target.value)
								}
								variant="ghost"
								className="font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Master, Beginner"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="space-y-1">
						<Label className="text-muted-foreground uppercase tracking-wider">
							Keywords (comma separated)
						</Label>
						<Textarea
							value={item.keywords?.join(", ") || ""}
							onChange={(e) => {
								const keywords = e.target.value
									.split(",")
									.map((k) => k.trim())
									.filter((k) => k);
								handleUpdate(index, "keywords", keywords);
							}}
							className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[60px] px-0"
							placeholder="HTML, CSS, JavaScript"
							disabled={!isOwner}
						/>
					</div>
				</div>
			)}
		/>
	);
}
