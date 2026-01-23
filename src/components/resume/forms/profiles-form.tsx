"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeProfileSocial } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";

interface ProfilesFormProps {
	items: ResumeProfileSocial[] | undefined;
	onChange: (items: ResumeProfileSocial[]) => void;
	isOwner: boolean;
}

export function ProfilesForm({ items, onChange, isOwner }: ProfilesFormProps) {
	const handleAdd = () => {
		const newItem: ResumeProfileSocial = {
			network: "",
			username: "",
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
		field: keyof ResumeProfileSocial,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Social Profiles"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			renderItem={(item, index) => (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Network
							</Label>
							<Input
								value={item.network || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"network",
										e.target.value
									)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Twitter, GitHub"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-muted-foreground uppercase tracking-wider">
								Username
							</Label>
							<Input
								value={item.username || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"username",
										e.target.value
									)
								}
								variant="ghost"
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="username"
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
								className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="https://..."
								disabled={!isOwner}
							/>
						</div>
					</div>
				</div>
			)}
		/>
	);
}
