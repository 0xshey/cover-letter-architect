"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ResumeData } from "@/types/resume";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { BasicsForm } from "./forms/basics-form";
import { WorkForm } from "./forms/work-form";
import { EducationForm } from "./forms/education-form";
import { VolunteerForm } from "./forms/volunteer-form";
import { AwardsForm } from "./forms/awards-form";
import { CertificatesForm } from "./forms/certificates-form";
import { PublicationsForm } from "./forms/publications-form";
import { SkillsForm } from "./forms/skills-form";
import { LanguagesForm } from "./forms/languages-form";
import { InterestsForm } from "./forms/interests-form";
import { ReferencesForm } from "./forms/references-form";
import { ProjectsForm } from "./forms/projects-form";
import { ProfilesForm } from "./forms/profiles-form";

interface ResumeFormProps {
	initialData: ResumeData;
	initialVisibleSections: Record<string, boolean>;
	resumeId: string;
	isOwner: boolean;
}

export function ResumeForm({
	initialData,
	initialVisibleSections,
	resumeId,
	isOwner,
}: ResumeFormProps) {
	const [data, setData] = useState<ResumeData>(initialData || {});
	const [visibleSections, setVisibleSections] = useState<
		Record<string, boolean>
	>(initialVisibleSections || {});
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const supabase = createClient();

	const updateResume = async (updates: {
		data?: ResumeData;
		visible_sections?: Record<string, boolean>;
	}) => {
		if (!isOwner) return;
		setIsSaving(true);
		try {
			const { error } = await supabase
				.from("resumes")
				.update({
					...updates,
					updated_at: new Date().toISOString(),
				})
				.eq("id", resumeId);

			if (error) throw error;
			setLastSaved(new Date());
		} catch (error) {
			console.error("Error saving resume:", error);
			toast.error("Failed to save changes");
		} finally {
			setIsSaving(false);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSaveData = useCallback(
		debounce((newData: ResumeData) => {
			updateResume({ data: newData });
		}, 1000),
		[resumeId, isOwner]
	);

	// Debounce visibility save separately or just simple save (usually less frequent)
	// For now, let's debounce it too to be safe, or just fire it.
	// Given usage frequency, 500ms debounce is fine.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSaveVisibility = useCallback(
		debounce((newVisibility: Record<string, boolean>) => {
			updateResume({ visible_sections: newVisibility });
		}, 500),
		[resumeId, isOwner]
	);

	const handleUpdate = (newData: ResumeData) => {
		setData(newData);
		debouncedSaveData(newData);
	};

	const handleVisibilityChange = (section: string, isVisible: boolean) => {
		const newVisibility = {
			...visibleSections,
			[section]: isVisible,
		};
		setVisibleSections(newVisibility);
		debouncedSaveVisibility(newVisibility);
	};

	const handleBasicsChange = (
		field: keyof NonNullable<ResumeData["basics"]>,
		value: any
	) => {
		const newData = {
			...data,
			basics: {
				...data.basics,
				[field]: value,
			},
		};
		handleUpdate(newData);
	};

	const handleLocationChange = (field: string, value: string) => {
		const newData = {
			...data,
			basics: {
				...data.basics,
				location: {
					...data.basics?.location,
					[field]: value,
				},
			},
		};
		handleUpdate(newData);
	};

	// Derived state
	const isModeEditing = isOwner && isEditing;

	// Helper to get props for sections
	const getSectionProps = (sectionId: string) => ({
		// Default to true if not set
		isVisible: visibleSections[sectionId] ?? true,
		onToggleVisibility: (visible: boolean) =>
			handleVisibilityChange(sectionId, visible),
		isOwner: isModeEditing, // Only "owner" (editable) when edit mode is on
		isRealOwner: isOwner, // For visibility toggles, we need the real ownership independent of edit mode?
		// Actually, user requested "When edit is active, allow a toggle".
		// So the toggle should only be visible when `isModeEditing` is true.
		// We can pass `isEditing={isModeEditing}` to the section.
	});

	return (
		<div className="w-full space-y-16 animate-in fade-in duration-500 pb-20">
			{/* Edit Toggle - Top Right */}
			{isOwner && (
				<div className="flex justify-end mb-4">
					<div className="flex items-center gap-2">
						<Label
							htmlFor="edit-mode"
							className="cursor-pointer text-sm font-medium text-muted-foreground"
						>
							Edit Mode
						</Label>
						<Switch
							id="edit-mode"
							checked={isEditing}
							onCheckedChange={setIsEditing}
						/>
					</div>
				</div>
			)}

			{/* Status Indicator - Bottom Right */}
			<div className="fixed bottom-4 right-4 z-50">
				{isSaving ? (
					<div className="bg-background/80 backdrop-blur border shadow-sm rounded-full px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
						<Loader2 className="h-3 w-3 animate-spin" />
						Saving...
					</div>
				) : lastSaved ? (
					<div className="bg-background/80 backdrop-blur border shadow-sm rounded-full px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground transition-opacity opacity-50 hover:opacity-100">
						<Save className="h-3 w-3" />
						Saved
					</div>
				) : null}
			</div>

			<BasicsForm
				basics={data.basics || {}}
				onChange={handleBasicsChange}
				onLocationChange={handleLocationChange}
				{...getSectionProps("basics")}
			/>

			<ProfilesForm
				items={data.basics?.profiles}
				onChange={(items) => handleBasicsChange("profiles", items)}
				{...getSectionProps("profiles")}
			/>

			<WorkForm
				items={data.work}
				onChange={(items) => handleUpdate({ ...data, work: items })}
				{...getSectionProps("work")}
			/>

			<EducationForm
				items={data.education}
				onChange={(items) =>
					handleUpdate({ ...data, education: items })
				}
				{...getSectionProps("education")}
			/>

			<ProjectsForm
				items={data.projects}
				onChange={(items) => handleUpdate({ ...data, projects: items })}
				{...getSectionProps("projects")}
			/>

			<VolunteerForm
				items={data.volunteer}
				onChange={(items) =>
					handleUpdate({ ...data, volunteer: items })
				}
				{...getSectionProps("volunteer")}
			/>

			<AwardsForm
				items={data.awards}
				onChange={(items) => handleUpdate({ ...data, awards: items })}
				{...getSectionProps("awards")}
			/>

			<CertificatesForm
				items={data.certificates}
				onChange={(items) =>
					handleUpdate({ ...data, certificates: items })
				}
				{...getSectionProps("certificates")}
			/>

			<PublicationsForm
				items={data.publications}
				onChange={(items) =>
					handleUpdate({ ...data, publications: items })
				}
				{...getSectionProps("publications")}
			/>

			<SkillsForm
				items={data.skills}
				onChange={(items) => handleUpdate({ ...data, skills: items })}
				{...getSectionProps("skills")}
			/>

			<LanguagesForm
				items={data.languages}
				onChange={(items) =>
					handleUpdate({ ...data, languages: items })
				}
				{...getSectionProps("languages")}
			/>

			<InterestsForm
				items={data.interests}
				onChange={(items) =>
					handleUpdate({ ...data, interests: items })
				}
				{...getSectionProps("interests")}
			/>

			<ReferencesForm
				items={data.references}
				onChange={(items) =>
					handleUpdate({ ...data, references: items })
				}
				{...getSectionProps("references")}
			/>
		</div>
	);
}
