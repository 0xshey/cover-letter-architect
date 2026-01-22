"use client";

import { Mail, Phone, Globe, Linkedin, Github, Twitter } from "lucide-react";
import { ContactInfo } from "@/types/resume";
import { ResumeSection } from "./resume-section";
import { EditableField } from "./editable-field";

interface ResumeContactProps {
	contact: ContactInfo | null;
	isVisible: boolean;
	isEditing: boolean;
	onToggleVisibility: () => void;
	onUpdate: (updates: Partial<ContactInfo>) => void;
}

const contactItems = [
	{ key: "email" as const, icon: Mail, label: "Email", prefix: "mailto:" },
	{ key: "phone" as const, icon: Phone, label: "Phone", prefix: "tel:" },
	{ key: "website" as const, icon: Globe, label: "Website", prefix: "" },
	{
		key: "linkedin" as const,
		icon: Linkedin,
		label: "LinkedIn",
		prefix: "https://linkedin.com/in/",
	},
	{
		key: "github" as const,
		icon: Github,
		label: "GitHub",
		prefix: "https://github.com/",
	},
	{
		key: "twitter" as const,
		icon: Twitter,
		label: "Twitter",
		prefix: "https://twitter.com/",
	},
];

export function ResumeContact({
	contact,
	isVisible,
	isEditing,
	onToggleVisibility,
	onUpdate,
}: ResumeContactProps) {
	return (
		<ResumeSection
			title="Contact"
			isVisible={isVisible}
			isEditing={isEditing}
			onToggleVisibility={onToggleVisibility}
		>
			<div className="space-y-3">
				{contactItems.map(({ key, icon: Icon, label, prefix }) => {
					const value = contact?.[key] || "";
					const hasValue = Boolean(value);

					// Only show in view mode if there's a value
					if (!hasValue && !isEditing) return null;

					const href = value
						? prefix
							? value.startsWith("http")
								? value
								: `${prefix}${value}`
							: value
						: undefined;

					return (
						<div key={key} className="flex items-center gap-3">
							<Icon className="h-4 w-4 text-muted-foreground shrink-0" />
							{isEditing ? (
								<EditableField
									value={value}
									onSave={(newValue) =>
										onUpdate({ [key]: newValue })
									}
									isEditing={isEditing}
									placeholder={label}
									className="text-sm"
								/>
							) : (
								<a
									href={href}
									target={
										key !== "email" && key !== "phone"
											? "_blank"
											: undefined
									}
									rel={
										key !== "email" && key !== "phone"
											? "noopener noreferrer"
											: undefined
									}
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									{value}
								</a>
							)}
						</div>
					);
				})}

				{/* Empty state in view mode */}
				{!isEditing &&
					!contactItems.some(({ key }) => contact?.[key]) && (
						<p className="text-sm text-muted-foreground italic">
							No contact information listed.
						</p>
					)}
			</div>
		</ResumeSection>
	);
}
