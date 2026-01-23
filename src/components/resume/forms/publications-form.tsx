"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumePublication } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface PublicationsFormProps {
	items: ResumePublication[] | undefined;
	onChange: (items: ResumePublication[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function PublicationsForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: PublicationsFormProps) {
	const handleAdd = () => {
		const newItem: ResumePublication = {
			name: "",
			publisher: "",
			releaseDate: "",
			url: "",
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
		field: keyof ResumePublication,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Publications"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Name
							</Label>
							<Input
								value={item.name || ""}
								onChange={(e) =>
									handleUpdate(index, "name", e.target.value)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Publication Title"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Publisher
							</Label>
							<Input
								value={item.publisher || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"publisher",
										e.target.value
									)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Publisher"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Release Date
							</Label>
							<Input
								value={item.releaseDate || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"releaseDate",
										e.target.value
									)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="YYYY-MM-DD"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								URL
							</Label>
							<Input
								value={item.url || ""}
								onChange={(e) =>
									handleUpdate(index, "url", e.target.value)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="https://publication.com"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground uppercase tracking-wider">
							Summary
						</Label>
						<Textarea
							value={item.summary || ""}
							onChange={(e) =>
								handleUpdate(index, "summary", e.target.value)
							}
							className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[60px] px-0"
							placeholder="Description..."
							disabled={!isOwner}
						/>
					</div>
				</div>
			)}
		/>
	);
}
