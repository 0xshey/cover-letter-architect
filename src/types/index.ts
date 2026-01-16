export type BlockCategory =
	| "Education"
	| "Experience"
	| "Projects"
	| "Skills"
	| "Motivation"
	| "Expectations"
	| "Personal";

export interface ContentBlock {
	id: string;
	category: BlockCategory;
	content: string;
	isEnabled: boolean;
}

export interface TargetInfo {
	companyName: string;
	roleTitle: string;
	addressee: string;
	authorName?: string;
	email?: string;
	isEmailEnabled?: boolean;
	phone?: string;
	isPhoneEnabled?: boolean;
	cityState?: string;
	isCityStateEnabled?: boolean;
	portfolioUrl?: string;
	isPortfolioUrlEnabled?: boolean;
	companyAddress?: string;
	jobId?: string;
}

export interface GeneratedLetter {
	id: string;
	markdown: string;
	rawText: string;
	createdAt: string; // ISO Date string
	targetCompany: string;
	targetRole: string;
}
