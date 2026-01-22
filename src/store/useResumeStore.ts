import { create } from "zustand";
import {
	ResumeProfile,
	WorkExperience,
	Education,
	Project,
	ContactInfo,
} from "@/types/resume";

interface ResumeState {
	// Data
	profile: ResumeProfile | null;
	workExperience: WorkExperience[];
	education: Education[];
	projects: Project[];
	contact: ContactInfo | null;

	// UI State
	isEditMode: boolean;
	isLoading: boolean;
	isSaving: boolean;

	// Actions
	setProfile: (profile: ResumeProfile | null) => void;
	setWorkExperience: (workExperience: WorkExperience[]) => void;
	setEducation: (education: Education[]) => void;
	setProjects: (projects: Project[]) => void;
	setContact: (contact: ContactInfo | null) => void;
	setEditMode: (isEditMode: boolean) => void;
	setLoading: (isLoading: boolean) => void;
	setSaving: (isSaving: boolean) => void;

	// Partial updates
	updateProfile: (updates: Partial<ResumeProfile>) => void;
	toggleSectionVisibility: (
		section:
			| "show_work_experience"
			| "show_education"
			| "show_projects"
			| "show_contact"
	) => void;

	// Reset
	reset: () => void;
}

const initialState = {
	profile: null,
	workExperience: [],
	education: [],
	projects: [],
	contact: null,
	isEditMode: false,
	isLoading: false,
	isSaving: false,
};

export const useResumeStore = create<ResumeState>()((set) => ({
	...initialState,

	setProfile: (profile) => set({ profile }),
	setWorkExperience: (workExperience) => set({ workExperience }),
	setEducation: (education) => set({ education }),
	setProjects: (projects) => set({ projects }),
	setContact: (contact) => set({ contact }),
	setEditMode: (isEditMode) => set({ isEditMode }),
	setLoading: (isLoading) => set({ isLoading }),
	setSaving: (isSaving) => set({ isSaving }),

	updateProfile: (updates) =>
		set((state) => ({
			profile: state.profile ? { ...state.profile, ...updates } : null,
		})),

	toggleSectionVisibility: (section) =>
		set((state) => ({
			profile: state.profile
				? { ...state.profile, [section]: !state.profile[section] }
				: null,
		})),

	reset: () => set(initialState),
}));
