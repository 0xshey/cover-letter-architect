// JSON Resume Schema Types
// https://jsonresume.org/schema/

export interface ResumeLocation {
	address?: string;
	postalCode?: string;
	city?: string;
	countryCode?: string;
	region?: string;
}

export interface ResumeProfileSocial {
	network: string;
	username: string;
	url?: string;
}

export interface ResumeBasics {
	name?: string;
	label?: string;
	image?: string;
	email?: string;
	phone?: string;
	url?: string;
	summary?: string;
	location?: ResumeLocation;
	profiles?: ResumeProfileSocial[];
}

export interface ResumeWork {
	name?: string;
	position?: string;
	url?: string;
	startDate?: string;
	endDate?: string;
	summary?: string;
	highlights?: string[];
}

export interface ResumeVolunteer {
	organization?: string;
	position?: string;
	url?: string;
	startDate?: string;
	endDate?: string;
	summary?: string;
	highlights?: string[];
}

export interface ResumeEducation {
	institution?: string;
	url?: string;
	area?: string;
	studyType?: string;
	startDate?: string;
	endDate?: string;
	score?: string;
	courses?: string[];
}

export interface ResumeAward {
	title?: string;
	date?: string;
	awarder?: string;
	summary?: string;
}

export interface ResumeCertificate {
	name?: string;
	date?: string;
	issuer?: string;
	url?: string;
}

export interface ResumePublication {
	name?: string;
	publisher?: string;
	releaseDate?: string;
	url?: string;
	summary?: string;
}

export interface ResumeSkill {
	name?: string;
	level?: string;
	keywords?: string[];
}

export interface ResumeLanguage {
	language?: string;
	fluency?: string;
}

export interface ResumeInterest {
	name?: string;
	keywords?: string[];
}

export interface ResumeReference {
	name?: string;
	reference?: string;
}

export interface ResumeProject {
	name?: string;
	startDate?: string;
	endDate?: string;
	description?: string;
	highlights?: string[];
	url?: string;
}

export interface ResumeData {
	basics?: ResumeBasics;
	work?: ResumeWork[];
	volunteer?: ResumeVolunteer[];
	education?: ResumeEducation[];
	awards?: ResumeAward[];
	certificates?: ResumeCertificate[];
	publications?: ResumePublication[];
	skills?: ResumeSkill[];
	languages?: ResumeLanguage[];
	interests?: ResumeInterest[];
	references?: ResumeReference[];
	projects?: ResumeProject[];
}

export interface SectionConfig {
	id: string;
	visible: boolean;
	title: string; // Display title
}

export interface Profile {
	id: string; // References auth.users(id)
	username: string | null;
	full_name: string | null;
	avatar_url?: string | null;
	updated_at?: string;
}

export interface ResumeRow {
	id: string;
	user_id: string; // References profiles(id)
	title: string;
	data: ResumeData;
	visible_sections: Record<string, boolean>;
	created_at: string;
	updated_at: string;
}

// Deprecated interfaces (kept for temporary compatibility if needed)
export interface WorkExperience {
	id: string;
	[key: string]: any;
}
export interface Education {
	id: string;
	[key: string]: any;
}
export interface Project {
	id: string;
	[key: string]: any;
}
export interface ContactInfo {
	id: string;
	[key: string]: any;
}
