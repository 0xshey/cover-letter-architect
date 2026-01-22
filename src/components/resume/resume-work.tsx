"use client";

import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { WorkExperience } from "@/types/resume";
import { ResumeSection } from "./resume-section";
import { Button } from "@/components/ui/button";

interface ResumeWorkProps {
	experiences: WorkExperience[];
	isVisible: boolean;
	isEditing: boolean;
	onToggleVisibility: () => void;
	onAdd: () => void;
	onUpdate: (id: string, updates: Partial<WorkExperience>) => void;
	onDelete: (id: string) => void;
}

function formatYearRange(startYear: number, endYear: number | null): string {
	const end = endYear ? endYear.toString() : "Now";
	return `${startYear} — ${end}`;
}

export function ResumeWork({
	experiences,
	isVisible,
	isEditing,
	onToggleVisibility,
	onAdd,
	onUpdate,
	onDelete,
}: ResumeWorkProps) {
	return (
		<ResumeSection
			title="Work Experience"
			isVisible={isVisible}
			isEditing={isEditing}
			onToggleVisibility={onToggleVisibility}
			className="border-b border-border/50"
		>
			<div className="space-y-6">
				{experiences
					.sort((a, b) => {
						// Sort by end year desc (current jobs first), then start year desc
						const aEnd = a.end_year ?? 9999;
						const bEnd = b.end_year ?? 9999;
						if (bEnd !== aEnd) return bEnd - aEnd;
						return b.start_year - a.start_year;
					})
					.map((exp) => (
						<div key={exp.id} className="flex gap-4 sm:gap-8 group">
							{/* Year Range */}
							<div className="w-24 sm:w-32 shrink-0 text-sm text-muted-foreground pt-0.5">
								{formatYearRange(exp.start_year, exp.end_year)}
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2">
									<div>
										{/* Title & Company */}
										<div className="flex items-center gap-1">
											<span className="font-medium text-foreground">
												{exp.title}
											</span>
											<span className="text-muted-foreground">
												at
											</span>
											{exp.company_link ? (
												<a
													href={exp.company_link}
													target="_blank"
													rel="noopener noreferrer"
													className="font-medium text-foreground hover:underline inline-flex items-center gap-0.5"
												>
													{exp.company}
													<ExternalLink className="h-3 w-3" />
												</a>
											) : (
												<span className="font-medium text-foreground">
													{exp.company}
												</span>
											)}
										</div>

										{/* Location */}
										{exp.location && (
											<p className="text-sm text-muted-foreground mt-0.5">
												{exp.location}
											</p>
										)}

										{/* Achievements */}
										{exp.achievements &&
											exp.achievements.length > 0 && (
												<ul className="mt-2 space-y-1">
													{exp.achievements.map(
														(achievement, i) => (
															<li
																key={i}
																className="text-sm text-muted-foreground flex items-start gap-2"
															>
																<span className="text-muted-foreground/50">
																	•
																</span>
																{achievement}
															</li>
														)
													)}
												</ul>
											)}
									</div>

									{/* Delete button (edit mode) */}
									{isEditing && (
										<button
											onClick={() => onDelete(exp.id)}
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

				{/* Add button (edit mode) */}
				{isEditing && (
					<Button
						variant="outline"
						size="sm"
						onClick={onAdd}
						className="w-full border-dashed"
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Work Experience
					</Button>
				)}

				{/* Empty state */}
				{experiences.length === 0 && !isEditing && (
					<p className="text-sm text-muted-foreground italic">
						No work experience listed.
					</p>
				)}
			</div>
		</ResumeSection>
	);
}
