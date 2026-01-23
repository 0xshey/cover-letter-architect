import { ResumeCertificate } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";
import { ResumeField } from "./resume-field";

interface CertificatesFormProps {
	items: ResumeCertificate[] | undefined;
	onChange: (items: ResumeCertificate[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function CertificatesForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: CertificatesFormProps) {
	const handleAdd = () => {
		const newItem: ResumeCertificate = {
			name: "",
			date: "",
			issuer: "",
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
		field: keyof ResumeCertificate,
		value: any
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Certificates"
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
							placeholder="Certificate Name"
						/>
						<ResumeField
							label="Issuer"
							value={item.issuer || ""}
							onChange={(v) => handleUpdate(index, "issuer", v)}
							isOwner={isOwner}
							placeholder="Issuer"
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
						<ResumeField
							label="URL"
							value={item.url || ""}
							onChange={(v) => handleUpdate(index, "url", v)}
							isOwner={isOwner}
							placeholder="https://certificate.com"
						/>
					</div>
				</div>
			)}
		/>
	);
}
