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
	// Line 1: Recipient (Only if provided)
	if (targetInfo.addressee) {
		addressBlock += `${safe(targetInfo.addressee)} \\\\\n`;
	}

	// Line 2: Company Name
	if (targetInfo.companyName) {
		addressBlock += `${safe(targetInfo.companyName)} \\\\\n`;
	}

	// Line 3: Company Location
	if (targetInfo.companyAddress) {
		addressBlock += `${safe(targetInfo.companyAddress)} \\\\\n`;
	}

	// Construct Subject Line
	let subjectLine = "";
	if (targetInfo.roleTitle) {
		let roleInfo = targetInfo.roleTitle;
		if (targetInfo.jobId) {
			roleInfo += ` (${targetInfo.jobId})`;
		}
		subjectLine = `\\noindent\\textbf{RE: Application for ${safe(
			roleInfo
		)}}\n\n\\vspace{1em}`;
	}

	// Construct Header Contact Info
	const linkParts = [];
	if (targetInfo.isEmailEnabled !== false && targetInfo.email) {
		linkParts.push(
			`\\href{mailto:${safe(targetInfo.email)}}{${safe(
				targetInfo.email
			)}}`
		);
	}
	if (targetInfo.isPhoneEnabled !== false && targetInfo.phone) {
		linkParts.push(safe(targetInfo.phone));
	}
	if (targetInfo.isPortfolioUrlEnabled !== false && targetInfo.portfolioUrl) {
		let url = targetInfo.portfolioUrl;
		if (!url.startsWith("http")) url = "https://" + url;
		// Strip protocol and www for display
		const displayUrl = targetInfo.portfolioUrl
			.replace(/^https?:\/\//, "")
			.replace(/^www\./, "");
		linkParts.push(`\\href{${safe(url)}}{${safe(displayUrl)}}`);
	}

	const headerLinks = linkParts.join(" $\\cdot$ ");
	const headerLocation =
		targetInfo.isCityStateEnabled !== false && targetInfo.cityState
			? safe(targetInfo.cityState)
			: "";

	// Format Body
	// Convert newlines to double newlines for paragraph breaks if needed
	const bodyEscaped = bodyContent
		.split("\n")
		.map((line) => safe(line))
		.join("\n");

	// For Salutation, default to "Hiring Manager" if no addressee
	const salutationRecipient = targetInfo.addressee || "Hiring Manager";

	const dateStr = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return `\\documentclass[11pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{parskip} % Adds vertical space between paragraphs, removes indentation
\\usepackage{xcolor}

% Remove page numbers
\\pagenumbering{gobble}

% Hyperlink Setup
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=blue,
}

\\begin{document}

% --- Header ---
\\begin{center}
    {\\huge \\bfseries ${safe(targetInfo.authorName || "")}} \\\\[0.4em]
    {\\small ${headerLinks}} \\\\[0.2em]
    {\\small ${headerLocation}}
\\end{center}

\\vspace{0.5em}
\\noindent\\rule{\\linewidth}{0.5pt}
\\vspace{1.5em}

% --- Date ---
${dateStr}
\\vspace{1em}

% --- Addressee ---
\\noindent
${addressBlock}
\\vspace{1em}

${subjectLine}

% --- Greeting ---
\\noindent
Dear ${safe(salutationRecipient)},

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
