"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeCertificate } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { cn } from "@/lib/utils";

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
								placeholder="Certificate Name"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-muted-foreground uppercase tracking-wider">
								Issuer
							</Label>
							<Input
								value={item.issuer || ""}
								onChange={(e) =>
									handleUpdate(
										index,
										"issuer",
										e.target.value
									)
								}
								variant="ghost"
								className="font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="Issuer"
								disabled={!isOwner}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-muted-foreground uppercase tracking-wider">
								Date
							</Label>
							<Input
								value={item.date || ""}
								onChange={(e) =>
									handleUpdate(index, "date", e.target.value)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="YYYY-MM-DD"
								disabled={!isOwner}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-muted-foreground uppercase tracking-wider">
								URL
							</Label>
							<Input
								value={item.url || ""}
								onChange={(e) =>
									handleUpdate(index, "url", e.target.value)
								}
								variant="ghost"
								className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
								placeholder="https://certificate.com"
								disabled={!isOwner}
							/>
						</div>
					</div>
				</div>
			)}
		/>
	);
}
