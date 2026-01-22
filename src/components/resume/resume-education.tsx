"use client";

import { Plus, Trash2 } from "lucide-react";
import { Education } from "@/types/resume";
import { ResumeSection } from "./resume-section";
import { Button } from "@/components/ui/button";

interface ResumeEducationProps {
	education: Education[];
	isVisible: boolean;
	isEditing: boolean;
	onToggleVisibility: () => void;
	onAdd: () => void;
	onUpdate: (id: string, updates: Partial<Education>) => void;
	onDelete: (id: string) => void;
}

function formatYearRange(
	startYear: number | null,
	endYear: number | null
): string {
	if (!startYear && !endYear) return "";
	if (!startYear) return endYear?.toString() || "";
	if (!endYear) return `${startYear} — Present`;
	if (startYear === endYear) return startYear.toString();
	return `${startYear} — ${endYear}`;
}

export function ResumeEducation({
	education,
	isVisible,
	isEditing,
	onToggleVisibility,
	onAdd,
	onUpdate,
	onDelete,
}: ResumeEducationProps) {
	return (
		<ResumeSection
			title="Education"
			isVisible={isVisible}
			isEditing={isEditing}
			onToggleVisibility={onToggleVisibility}
			className="border-b border-border/50"
		>
			<div className="space-y-6">
				{education
					.sort((a, b) => {
						const aEnd = a.end_year ?? 9999;
						const bEnd = b.end_year ?? 9999;
						if (bEnd !== aEnd) return bEnd - aEnd;
						return (b.start_year ?? 0) - (a.start_year ?? 0);
					})
					.map((edu) => (
						<div key={edu.id} className="flex gap-4 sm:gap-8 group">
							{/* Year Range */}
							<div className="w-24 sm:w-32 shrink-0 text-sm text-muted-foreground pt-0.5">
								{formatYearRange(edu.start_year, edu.end_year)}
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2">
									<div>
										<p className="font-medium text-foreground">
											{edu.institution}
										</p>
										{(edu.degree || edu.field) && (
											<p className="text-sm text-muted-foreground mt-0.5">
												{[edu.degree, edu.field]
													.filter(Boolean)
													.join(" in ")}
											</p>
										)}
									</div>

									{isEditing && (
										<button
											onClick={() => onDelete(edu.id)}
											className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:text-destructive/80 transition-all"
											title="Delete"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>
						</div>
					))}

				{isEditing && (
					<Button
						variant="outline"
						size="sm"
						onClick={onAdd}
						className="w-full border-dashed"
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Education
					</Button>
				)}

				{education.length === 0 && !isEditing && (
					<p className="text-sm text-muted-foreground italic">
						No education listed.
					</p>
				)}
			</div>
		</ResumeSection>
	);
}
