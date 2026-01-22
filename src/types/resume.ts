// Resume profile types

export interface ResumeProfile {
	id: string;
	user_id: string;
	name: string;
	job_title: string | null;
	location: string | null;
	primary_link: string | null;
	profile_image_url: string | null;
	about: string | null;
	show_work_experience: boolean;
	show_education: boolean;
	show_projects: boolean;
	show_contact: boolean;
	created_at: string;
	updated_at: string;
}

export interface WorkExperience {
	id: string;
	resume_id: string;
	title: string;
	company: string;
	company_link: string | null;
	location: string | null;
	start_year: number;
	end_year: number | null; // null means "Now"
	achievements: string[] | null;
	sort_order: number;
	created_at: string;
}

export interface Education {
	id: string;
	resume_id: string;
	institution: string;
	degree: string | null;
	field: string | null;
	start_year: number | null;
	end_year: number | null;
	sort_order: number;
	created_at: string;
}

export interface Project {
	id: string;
	resume_id: string;
	title: string;
	description: string | null;
	link: string | null;
	year: number | null;
	sort_order: number;
	created_at: string;
}

export interface ContactInfo {
	id: string;
	resume_id: string;
	email: string | null;
	phone: string | null;
	website: string | null;
	linkedin: string | null;
	github: string | null;
	twitter: string | null;
	created_at: string;
}

// Combined resume data type
export interface ResumeData {
	profile: ResumeProfile;
	workExperience: WorkExperience[];
	education: Education[];
	projects: Project[];
	contact: ContactInfo | null;
}

// Form types for creating/editing
export type ResumeProfileInput = Omit<
	ResumeProfile,
	"id" | "created_at" | "updated_at"
>;
export type WorkExperienceInput = Omit<
	WorkExperience,
	"id" | "resume_id" | "created_at"
>;
export type EducationInput = Omit<Education, "id" | "resume_id" | "created_at">;
export type ProjectInput = Omit<Project, "id" | "resume_id" | "created_at">;
export type ContactInfoInput = Omit<
	ContactInfo,
	"id" | "resume_id" | "created_at"
>;
