"use client";

import { ResumeWork } from "@/types/resume";
import { ArrayFormSection } from "./array-form-section";
import { ResumeField } from "./resume-field";
import { cn } from "@/lib/utils";

interface WorkFormProps {
	items: ResumeWork[] | undefined;
	onChange: (items: ResumeWork[]) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function WorkForm({
	items,
	onChange,
	isOwner,
	isVisible,
	onToggleVisibility,
}: WorkFormProps) {
	const handleAdd = () => {
		const newItem: ResumeWork = {
			name: "",
			position: "",
			startDate: "",
			endDate: "",
			summary: "",
			highlights: [],
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
		field: keyof ResumeWork,
		value: any,
	) => {
		if (!items) return;
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange(newItems);
	};

	return (
		<ArrayFormSection
			title="Work Experience"
			items={items}
			addItem={handleAdd}
			removeItem={handleRemove}
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
			renderItem={(item, index) => (
				<div className="grid grid-cols-3">
					<div className="col-span-1">
						{isOwner ? (
							<div className="flex gap-4">
								<ResumeField
									label="Start Date"
									value={item.startDate || ""}
									onChange={(v) => {
										if (v === "" || /^\d{0,4}$/.test(v)) {
											handleUpdate(index, "startDate", v);
										}
									}}
									isOwner={isOwner}
									placeholder="YYYY"
									InputClassName="w-24 text-center"
								/>
								<ResumeField
									label="End Date"
									value={item.endDate || ""}
									onChange={(v) => {
										if (
											v === "" ||
											/^\d{0,4}$/.test(v) ||
											/^p(r(e(s(e(n(t)?)?)?)?)?)?$/i.test(
												v,
											)
										) {
											const lower = v.toLowerCase();
											if (lower === "present") {
												handleUpdate(
													index,
													"endDate",
													"Present",
												);
											} else {
												handleUpdate(
													index,
													"endDate",
													v,
												);
											}
										}
									}}
									isOwner={isOwner}
									placeholder="YYYY / Present"
									InputClassName="w-32 text-center"
								/>
							</div>
						) : (
							<p className="text-muted-foreground text-sm">
								{item.startDate} – {item.endDate}
							</p>
						)}
					</div>

					<div
						className={cn(
							"col-span-2 flex flex-col",
							isOwner && "gap-6",
						)}
					>
						<ResumeField
							label="Position"
							value={item.position || ""}
							onChange={(v) => handleUpdate(index, "position", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Job Title"
							InputClassName="font-bold"
						/>
						<ResumeField
							label="Company"
							value={item.name || ""}
							onChange={(v) => handleUpdate(index, "name", v)}
							isOwner={isOwner}
							variant="primary"
							placeholder="Company Name"
							InputClassName="text-foreground"
						/>
						<ResumeField
							label="Summary"
							value={item.summary || ""}
							onChange={(v) => handleUpdate(index, "summary", v)}
							isOwner={isOwner}
							variant="richtext"
							placeholder="Describe your responsibilities and achievements..."
						/>
						<ResumeField
							label="Website"
							value={item.url || ""}
							onChange={(v) => handleUpdate(index, "url", v)}
							isOwner={isOwner}
							placeholder="https://company.com"
						/>
					</div>
				</div>
			)}
		/>
	);
}
