import { ResumeProfileSocial } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface ProfilesFormProps {
	items: ResumeProfileSocial[] | undefined;
	onChange: (items: ResumeProfileSocial[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function ProfilesForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: ProfilesFormProps) {
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
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className={cn("space-y-4", isOwner && "space-y-6")}>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ResumeField
							label="Network"
							value={item.network || ""}
							onChange={(v) => handleUpdate(index, "network", v)}
							isOwner={isOwner}
							placeholder="Twitter, GitHub"
						/>
						<ResumeField
							label="Username"
							value={item.username || ""}
							onChange={(v) => handleUpdate(index, "username", v)}
							isOwner={isOwner}
							placeholder="username"
						/>
						<ResumeField
							label="URL"
							value={item.url || ""}
							onChange={(v) => handleUpdate(index, "url", v)}
							isOwner={isOwner}
							placeholder="https://..."
						/>
					</div>
				</div>
			)}
		/>
	);
}
