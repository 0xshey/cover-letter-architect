import { TargetInfo } from "@/types";

export const generateLatexCode = (
	targetInfo: TargetInfo,
	bodyContent: string
): string => {
	// Escape LaTeX special characters
	const escapeLatex = (text: string) => {
		return text
			.replace(/\\/g, "\\textbackslash{}")
			.replace(/([&%$#_{}])/g, "\\$1")
			.replace(/~/g, "\\textasciitilde{}")
			.replace(/\^/g, "\\textasciicircum{}");
	};

	const safe = (text?: string) => (text ? escapeLatex(text) : "");
	const safeRaw = (text?: string) => text || "";

	// Construct Address Block
	let addressBlock = "";
	// Line 1: Recipient
	const recipient = targetInfo.addressee || "Hiring Manager";
	addressBlock += `${safe(recipient)} \\\\\n`;

	// Line 2: Role / Job ID
	if (targetInfo.roleTitle) {
		let roleLine = targetInfo.roleTitle;
		if (targetInfo.jobId) {
			roleLine += ` (${targetInfo.jobId})`;
		}
		addressBlock += `${safe(roleLine)} \\\\\n`;
	}

	// Line 3: Company Name
	if (targetInfo.companyName) {
		addressBlock += `${safe(targetInfo.companyName)} \\\\\n`;
	}

	// Line 4: Company Location
	if (targetInfo.companyAddress) {
		addressBlock += `${safe(targetInfo.companyAddress)} \\\\\n`;
	}

	// Construct Header Contact Info
	const contactParts = [];
	if (targetInfo.isEmailEnabled !== false && targetInfo.email) {
		contactParts.push(
			`\\href{mailto:${safe(targetInfo.email)}}{${safe(
				targetInfo.email
			)}}`
		);
	}
	if (targetInfo.isPhoneEnabled !== false && targetInfo.phone) {
		contactParts.push(safe(targetInfo.phone));
	}
	if (targetInfo.isCityStateEnabled !== false && targetInfo.cityState) {
		contactParts.push(safe(targetInfo.cityState));
	}
	if (targetInfo.isPortfolioUrlEnabled !== false && targetInfo.portfolioUrl) {
		let url = targetInfo.portfolioUrl;
		if (!url.startsWith("http")) url = "https://" + url;
		contactParts.push(
			`\\href{${safe(url)}}{${safe(targetInfo.portfolioUrl)}}`
		);
	}
	const headerContact = contactParts.join(" $\\cdot$ ");

	// Format Body
	// Convert newlines to double newlines for paragraph breaks if needed
	const bodyEscaped = bodyContent
		.split("\n")
		.map((line) => safe(line))
		.join("\n");

	const dateStr = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return `\\documentclass{article}
\\usepackage{hyperref}
\\usepackage{graphicx}

% Minimal minimal preamble for compatibility with JS-based LaTeX parsers
% Standard Article Class

\\begin{document}

% --- Header ---
\\begin{center}
    {\\huge \\bfseries ${safe(targetInfo.authorName || "")}} \\\\[0.5em]
    {\\small ${headerContact}}
\\end{center}

\\vspace{1em}
\\noindent\\rule{\\linewidth}{0.4pt}
\\vspace{1.5em}

% --- Date ---
${dateStr}
\\vspace{1.5em}

% --- Addressee ---
\\noindent
${addressBlock}
\\vspace{1em}

% --- Greeting ---
\\noindent
Dear ${safe(recipient)},

\\vspace{1em}

% --- Body ---
${bodyEscaped}

\\vspace{2em}

% --- Sign-off ---
\\noindent
Sincerely,

\\vspace{2em}

\\noindent
${safe(targetInfo.authorName || "")}

\\end{document}
`.trim();
};
