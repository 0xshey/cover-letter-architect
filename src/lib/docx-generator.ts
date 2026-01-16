import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	AlignmentType,
	HeadingLevel,
	ExternalHyperlink,
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
	// 2. Contact Info Line (constructed from enabled fields)
	const contactChildren = [];
	const separator = new TextRun({ text: " | ", size: 20, color: "666666" });

	if (targetInfo.isEmailEnabled !== false && targetInfo.email) {
		contactChildren.push(
			new ExternalHyperlink({
				children: [
					new TextRun({
						text: targetInfo.email,
						style: "Hyperlink",
						size: 20,
					}),
				],
				link: `mailto:${targetInfo.email}`,
			})
		);
	}

	if (targetInfo.isPhoneEnabled !== false && targetInfo.phone) {
		if (contactChildren.length > 0) contactChildren.push(separator);
		contactChildren.push(
			new TextRun({ text: targetInfo.phone, size: 20, color: "666666" })
		);
	}

	if (targetInfo.isCityStateEnabled !== false && targetInfo.cityState) {
		if (contactChildren.length > 0) contactChildren.push(separator);
		contactChildren.push(
			new TextRun({
				text: targetInfo.cityState,
				size: 20,
				color: "666666",
			})
		);
	}

	if (targetInfo.isPortfolioUrlEnabled !== false && targetInfo.portfolioUrl) {
		if (contactChildren.length > 0) contactChildren.push(separator);
		let url = targetInfo.portfolioUrl;
		if (!url.startsWith("http")) url = "https://" + url;
		contactChildren.push(
			new ExternalHyperlink({
				children: [
					new TextRun({
						text: targetInfo.portfolioUrl,
						style: "Hyperlink",
						size: 20,
					}),
				],
				link: url,
			})
		);
	}

	if (contactChildren.length > 0) {
		paragraphs.push(
			new Paragraph({
				alignment: AlignmentType.CENTER,
				children: contactChildren,
				spacing: { after: 400 }, // space after header
			})
		);
	}

	// 3. Date
	paragraphs.push(
		new Paragraph({
			children: [
				new TextRun({
					text: new Date().toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					}),
					size: 22, // 11pt
				}),
			],
			spacing: { after: 400 },
		})
	);

	// 4. Addressee Block
	const addresseeLines = [];

	// Line 1: Recipient Name or Generic Title
	if (targetInfo.addressee) {
		addresseeLines.push(targetInfo.addressee);
	} else {
		addresseeLines.push("Hiring Manager");
	}

	// Line 2: Role Title (e.g. "Software Engineer Application")
	if (targetInfo.roleTitle) {
		let roleLine = targetInfo.roleTitle;
		if (targetInfo.jobId) {
			roleLine += ` (${targetInfo.jobId})`;
		}
		addresseeLines.push(roleLine);
	}

	// Line 3: Company Name
	if (targetInfo.companyName) {
		addresseeLines.push(targetInfo.companyName);
	}

	// Line 4: Company Location
	if (targetInfo.companyAddress) {
		addresseeLines.push(targetInfo.companyAddress);
	}

	for (const line of addresseeLines) {
		paragraphs.push(
			new Paragraph({
				children: [new TextRun({ text: line, size: 22 })],
			})
		);
	}
	// Add spacing after address block
	paragraphs[paragraphs.length - 1] = new Paragraph({
		children: [
			new TextRun({
				text: addresseeLines[addresseeLines.length - 1],
				size: 22,
			}),
		],
		spacing: { after: 400 },
	});

	// 5. Greeting
	paragraphs.push(
		new Paragraph({
			children: [
				new TextRun({
					text: `Dear ${targetInfo.addressee || "Hiring Manager"},`,
					size: 22,
				}),
			],
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
					children: [
						new TextRun({ text: paraText.trim(), size: 22 }),
					],
					spacing: { after: 200 }, // Standard paragraph spacing
				})
			);
		}
	}

	// 7. Sign-off
	paragraphs.push(
		new Paragraph({
			children: [new TextRun({ text: "Sincerely,", size: 22 })],
			spacing: { before: 400, after: 600 }, // Space before signoff, Space for signature
		})
	);

	if (targetInfo.authorName) {
		paragraphs.push(
			new Paragraph({
				children: [
					new TextRun({ text: targetInfo.authorName, size: 22 }),
				],
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
