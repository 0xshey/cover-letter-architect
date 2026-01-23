import { ResumePublication } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

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
				<div className={cn("space-y-4", isOwner && "space-y-6")}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ResumeField
							label="Name"
							value={item.name || ""}
							onChange={(v) => handleUpdate(index, "name", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Publication Title"
						/>
						<ResumeField
							label="Publisher"
							value={item.publisher || ""}
							onChange={(v) =>
								handleUpdate(index, "publisher", v)
							}
							isOwner={isOwner}
							placeholder="Publisher"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<ResumeField
							label="Release Date"
							value={item.releaseDate || ""}
							onChange={(v) =>
								handleUpdate(index, "releaseDate", v)
							}
							isOwner={isOwner}
							placeholder="YYYY-MM-DD"
						/>
						<ResumeField
							label="URL"
							value={item.url || ""}
							onChange={(v) => handleUpdate(index, "url", v)}
							isOwner={isOwner}
							placeholder="https://publication.com"
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
