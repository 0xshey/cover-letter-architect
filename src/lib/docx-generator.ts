import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	AlignmentType,
	HeadingLevel,
} from "docx";
import { TargetInfo } from "@/types";

export const createCoverLetterDoc = async (
	targetInfo: TargetInfo,
	bodyContent: string
): Promise<Blob> => {
	const paragraphs = [];

	// 1. Author Header
	if (targetInfo.authorName) {
		paragraphs.push(
			new Paragraph({
				text: targetInfo.authorName,
				heading: HeadingLevel.HEADING_1,
				alignment: AlignmentType.CENTER,
				spacing: { after: 120 }, // slight space
			})
		);
	}

	// 2. Contact Info Line (constructed from enabled fields)
	const contactParts = [];
	if (targetInfo.isEmailEnabled !== false && targetInfo.email)
		contactParts.push(targetInfo.email);
	if (targetInfo.isPhoneEnabled !== false && targetInfo.phone)
		contactParts.push(targetInfo.phone);
	if (targetInfo.isCityStateEnabled !== false && targetInfo.cityState)
		contactParts.push(targetInfo.cityState);
	if (targetInfo.isPortfolioUrlEnabled !== false && targetInfo.portfolioUrl)
		contactParts.push(targetInfo.portfolioUrl);

	if (contactParts.length > 0) {
		paragraphs.push(
			new Paragraph({
				alignment: AlignmentType.CENTER,
				children: [
					new TextRun({
						text: contactParts.join(" | "),
						size: 20, // 10pt
						color: "666666",
					}),
				],
				spacing: { after: 400 }, // space after header
			})
		);
	}

	// 3. Date
	paragraphs.push(
		new Paragraph({
			text: new Date().toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			}),
			spacing: { after: 400 },
		})
	);

	// 4. Addressee Block
	const addresseeLines = [];
	if (targetInfo.addressee) addresseeLines.push(targetInfo.addressee);
	if (targetInfo.roleTitle)
		addresseeLines.push("Hiring Manager for " + targetInfo.roleTitle);
	// Wait, if Addressee is "Hiring Manager", line 2 is redundant?
	// Logic: If addressee is present, use it. If not, default to "Hiring Manager"

	// Better logic:
	// Line 1: Addressee Name (or "Hiring Manager")
	// Line 2: Role (if relevant to recipient?) No, usually Company Name and Address follow.
	// Since we only have Company Name, let's just list Company.

	// Standard block:
	// Name
	// Title?
	// Company

	if (targetInfo.addressee) {
		addresseeLines.push(targetInfo.addressee);
	} else {
		addresseeLines.push("Hiring Manager");
	}

	if (targetInfo.companyName) {
		addresseeLines.push(targetInfo.companyName);
	}

	for (const line of addresseeLines) {
		paragraphs.push(new Paragraph({ text: line }));
	}
	// Add spacing after address block
	paragraphs[paragraphs.length - 1] = new Paragraph({
		text: addresseeLines[addresseeLines.length - 1],
		spacing: { after: 400 },
	});

	// 5. Greeting
	paragraphs.push(
		new Paragraph({
			text: `Dear ${targetInfo.addressee || "Hiring Manager"},`,
			spacing: { after: 200 },
		})
	);

	// 6. Body Paragraphs
	// Split by double newline to identify paragraphs
	const bodyParas = bodyContent.split(/\n\s*\n/);
	for (const paraText of bodyParas) {
		if (paraText.trim()) {
			paragraphs.push(
				new Paragraph({
					children: [new TextRun(paraText.trim())],
					spacing: { after: 200 }, // Standard paragraph spacing
				})
			);
		}
	}

	// 7. Sign-off
	paragraphs.push(
		new Paragraph({
			text: "Sincerely,",
			spacing: { before: 400, after: 600 }, // Space before signoff, Space for signature
		})
	);

	if (targetInfo.authorName) {
		paragraphs.push(
			new Paragraph({
				text: targetInfo.authorName,
			})
		);
	}

	const doc = new Document({
		sections: [
			{
				properties: {},
				children: paragraphs,
			},
		],
	});

	return await Packer.toBlob(doc);
};
