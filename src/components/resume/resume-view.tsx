"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useResumeStore } from "@/store/useResumeStore";
import {
	ResumeProfile,
	WorkExperience,
	Education,
	Project,
	ContactInfo,
} from "@/types/resume";

import { Button } from "@/components/ui/button";
import {
	ResumeHeader,
	ResumeAbout,
	ResumeWork,
	ResumeEducation,
	ResumeProjects,
	ResumeContact,
} from "@/components/resume";

interface ResumeViewProps {
	userId: string;
}

export function ResumeView({ userId }: ResumeViewProps) {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);
	const { session } = useAuthStore();
	const {
		profile,
		workExperience,
		education,
		projects,
		contact,
		isEditMode,
		isLoading,
		isSaving,
		setProfile,
		setWorkExperience,
		setEducation,
		setProjects,
		setContact,
		setEditMode,
		setLoading,
		setSaving,
		updateProfile,
		toggleSectionVisibility,
		reset,
	} = useResumeStore();

	const isOwner = session?.user?.id === userId;
	const [notFound, setNotFound] = useState(false);
	// Fetch resume data
	useEffect(() => {
		const fetchResumeData = async () => {
			setLoading(true);
			try {
				// Fetch profile
				const { data: profileData, error: profileError } =
					await supabase
						.from("resume_profiles")
						.select("*")
						.eq("user_id", userId)
						.single();

				let currentProfile = profileData;

				if (profileError) {
					if (profileError.code === "PGRST116") {
						// No profile found
						if (isOwner) {
							// Create a new profile for the owner
							const { data: newProfile, error: createError } =
								await supabase
									.from("resume_profiles")
									.insert({
										user_id: userId,
										name:
											session?.user?.email || "Your Name",
									})
									.select()
									.single();

							if (createError) throw createError;
							currentProfile = newProfile;
							setProfile(newProfile);
						} else {
							setNotFound(true);
							setLoading(false);
							return;
						}
					} else {
						throw profileError;
					}
				} else {
					setProfile(profileData);
				}

				// Get the resume_id from the current profile
				const resumeId = currentProfile?.id;
				if (!resumeId) {
					setLoading(false);
					return;
				}

				// Fetch related data
				const [workRes, eduRes, projRes, contactRes] =
					await Promise.all([
						supabase
							.from("resume_work_experience")
							.select("*")
							.eq("resume_id", resumeId)
							.order("sort_order"),
						supabase
							.from("resume_education")
							.select("*")
							.eq("resume_id", resumeId)
							.order("sort_order"),
						supabase
							.from("resume_projects")
							.select("*")
							.eq("resume_id", resumeId)
							.order("sort_order"),
						supabase
							.from("resume_contact")
							.select("*")
							.eq("resume_id", resumeId)
							.limit(1),
					]);

				setWorkExperience(workRes.data || []);
				setEducation(eduRes.data || []);
				setProjects(projRes.data || []);
				setContact(contactRes.data?.[0] || null);
			} catch (error) {
				console.error("Error fetching resume:", error);
				toast.error("Failed to load resume");
			} finally {
				setLoading(false);
			}
		};

		fetchResumeData();

		return () => reset();
	}, [
		userId,
		isOwner,
		session?.user?.email,
		supabase,
		setProfile,
		setWorkExperience,
		setEducation,
		setProjects,
		setContact,
		setLoading,
		reset,
	]);

	// Save profile changes
	const handleSaveProfile = async (updates: Partial<ResumeProfile>) => {
		if (!profile) return;
		updateProfile(updates);

		try {
			const { error } = await supabase
				.from("resume_profiles")
				.update(updates)
				.eq("id", profile.id);

			if (error) throw error;
		} catch (error) {
			console.error("Error saving profile:", error);
			toast.error("Failed to save changes");
		}
	};

	// Toggle section visibility
	const handleToggleSection = async (
		section:
			| "show_work_experience"
			| "show_education"
			| "show_projects"
			| "show_contact"
	) => {
		if (!profile) return;
		const newValue = !profile[section];
		toggleSectionVisibility(section);

		try {
			const { error } = await supabase
				.from("resume_profiles")
				.update({ [section]: newValue })
				.eq("id", profile.id);

			if (error) throw error;
		} catch (error) {
			console.error("Error toggling section:", error);
			toast.error("Failed to update visibility");
		}
	};

	// Work experience handlers
	const handleAddWorkExperience = async () => {
		if (!profile) return;
		try {
			const { data, error } = await supabase
				.from("resume_work_experience")
				.insert({
					resume_id: profile.id,
					title: "New Position",
					company: "Company",
					start_year: new Date().getFullYear(),
					sort_order: workExperience.length,
				})
				.select()
				.single();

			if (error) throw error;
			setWorkExperience([...workExperience, data]);
			toast.success("Work experience added");
		} catch (error) {
			console.error("Error adding work experience:", error);
			toast.error("Failed to add work experience");
		}
	};

	const handleDeleteWorkExperience = async (id: string) => {
		try {
			const { error } = await supabase
				.from("resume_work_experience")
				.delete()
				.eq("id", id);

			if (error) throw error;
			setWorkExperience(workExperience.filter((w) => w.id !== id));
			toast.success("Work experience deleted");
		} catch (error) {
			console.error("Error deleting work experience:", error);
			toast.error("Failed to delete");
		}
	};

	// Education handlers
	const handleAddEducation = async () => {
		if (!profile) return;
		try {
			const { data, error } = await supabase
				.from("resume_education")
				.insert({
					resume_id: profile.id,
					institution: "Institution",
					sort_order: education.length,
				})
				.select()
				.single();

			if (error) throw error;
			setEducation([...education, data]);
			toast.success("Education added");
		} catch (error) {
			console.error("Error adding education:", error);
			toast.error("Failed to add education");
		}
	};

	const handleDeleteEducation = async (id: string) => {
		try {
			const { error } = await supabase
				.from("resume_education")
				.delete()
				.eq("id", id);

			if (error) throw error;
			setEducation(education.filter((e) => e.id !== id));
			toast.success("Education deleted");
		} catch (error) {
			console.error("Error deleting education:", error);
			toast.error("Failed to delete");
		}
	};

	// Project handlers
	const handleAddProject = async () => {
		if (!profile) return;
		try {
			const { data, error } = await supabase
				.from("resume_projects")
				.insert({
					resume_id: profile.id,
					title: "New Project",
					sort_order: projects.length,
				})
				.select()
				.single();

			if (error) throw error;
			setProjects([...projects, data]);
			toast.success("Project added");
		} catch (error) {
			console.error("Error adding project:", error);
			toast.error("Failed to add project");
		}
	};

	const handleDeleteProject = async (id: string) => {
		try {
			const { error } = await supabase
				.from("resume_projects")
				.delete()
				.eq("id", id);

			if (error) throw error;
			setProjects(projects.filter((p) => p.id !== id));
			toast.success("Project deleted");
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed to delete");
		}
	};

	// Contact handler
	const handleUpdateContact = async (updates: Partial<ContactInfo>) => {
		if (!profile) return;

		try {
			if (contact) {
				// Update existing
				const { error } = await supabase
					.from("resume_contact")
					.update(updates)
					.eq("id", contact.id);

				if (error) throw error;
				setContact({ ...contact, ...updates });
			} else {
				// Create new
				const { data, error } = await supabase
					.from("resume_contact")
					.insert({ resume_id: profile.id, ...updates })
					.select()
					.single();

				if (error) throw error;
				setContact(data);
			}
		} catch (error) {
			console.error("Error updating contact:", error);
			toast.error("Failed to update contact");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (notFound) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-center">
				<h1 className="text-2xl font-semibold mb-2">
					Resume Not Found
				</h1>
				<p className="text-muted-foreground mb-4">
					This user hasn't created their resume yet.
				</p>
				<Button variant="outline" onClick={() => router.push("/")}>
					Go Home
				</Button>
			</div>
		);
	}

	if (!profile) return null;

	return (
		<div className="w-full max-w-2xl mx-auto py-8 px-4">
			{/* Edit Mode Toggle (Owner Only) */}
			{isOwner && (
				<div className="flex justify-end mb-6">
					<Button
						variant={isEditMode ? "default" : "outline"}
						size="sm"
						onClick={() => setEditMode(!isEditMode)}
					>
						{isEditMode ? (
							<>
								<X className="h-4 w-4 mr-2" />
								Exit Edit Mode
							</>
						) : (
							<>
								<Pencil className="h-4 w-4 mr-2" />
								Edit Resume
							</>
						)}
					</Button>
				</div>
			)}

			{/* Header */}
			<ResumeHeader
				profile={profile}
				isEditing={isEditMode}
				onUpdate={handleSaveProfile}
			/>

			{/* About */}
			<ResumeAbout
				about={profile.about}
				isEditing={isEditMode}
				onUpdate={(about) => handleSaveProfile({ about })}
			/>

			{/* Work Experience */}
			<ResumeWork
				experiences={workExperience}
				isVisible={profile.show_work_experience}
				isEditing={isEditMode}
				onToggleVisibility={() =>
					handleToggleSection("show_work_experience")
				}
				onAdd={handleAddWorkExperience}
				onUpdate={() => {}}
				onDelete={handleDeleteWorkExperience}
			/>

			{/* Education */}
			<ResumeEducation
				education={education}
				isVisible={profile.show_education}
				isEditing={isEditMode}
				onToggleVisibility={() => handleToggleSection("show_education")}
				onAdd={handleAddEducation}
				onUpdate={() => {}}
				onDelete={handleDeleteEducation}
			/>

			{/* Projects */}
			<ResumeProjects
				projects={projects}
				isVisible={profile.show_projects}
				isEditing={isEditMode}
				onToggleVisibility={() => handleToggleSection("show_projects")}
				onAdd={handleAddProject}
				onUpdate={() => {}}
				onDelete={handleDeleteProject}
			/>

			{/* Contact */}
			<ResumeContact
				contact={contact}
				isVisible={profile.show_contact}
				isEditing={isEditMode}
				onToggleVisibility={() => handleToggleSection("show_contact")}
				onUpdate={handleUpdateContact}
			/>
		</div>
	);
}
