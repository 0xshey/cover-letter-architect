"use client";

import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { Project } from "@/types/resume";
import { ResumeSection } from "./resume-section";
import { Button } from "@/components/ui/button";

interface ResumeProjectsProps {
	projects: Project[];
	isVisible: boolean;
	isEditing: boolean;
	onToggleVisibility: () => void;
	onAdd: () => void;
	onUpdate: (id: string, updates: Partial<Project>) => void;
	onDelete: (id: string) => void;
}

export function ResumeProjects({
	projects,
	isVisible,
	isEditing,
	onToggleVisibility,
	onAdd,
	onUpdate,
	onDelete,
}: ResumeProjectsProps) {
	return (
		<ResumeSection
			title="Projects"
			isVisible={isVisible}
			isEditing={isEditing}
			onToggleVisibility={onToggleVisibility}
			className="border-b border-border/50"
		>
			<div className="space-y-6">
				{projects
					.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
					.map((project) => (
						<div
							key={project.id}
							className="flex gap-4 sm:gap-8 group"
						>
							{/* Year */}
							<div className="w-24 sm:w-32 shrink-0 text-sm text-muted-foreground pt-0.5">
								{project.year || ""}
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2">
									<div>
										{project.link ? (
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
											>
												{project.title}
												<ExternalLink className="h-3 w-3" />
											</a>
										) : (
											<p className="font-medium text-foreground">
												{project.title}
											</p>
										)}

										{project.description && (
											<p className="text-sm text-muted-foreground mt-0.5">
												{project.description}
											</p>
										)}
									</div>

									{isEditing && (
										<button
											onClick={() => onDelete(project.id)}
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
						Add Project
					</Button>
				)}

				{projects.length === 0 && !isEditing && (
					<p className="text-sm text-muted-foreground italic">
						No projects listed.
					</p>
				)}
			</div>
		</ResumeSection>
	);
}
