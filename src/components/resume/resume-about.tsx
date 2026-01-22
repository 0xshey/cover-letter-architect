"use client";

import { EditableField } from "./editable-field";

interface ResumeAboutProps {
	about: string | null;
	isEditing: boolean;
	onUpdate: (about: string) => void;
}

export function ResumeAbout({ about, isEditing, onUpdate }: ResumeAboutProps) {
	return (
		<div className="py-6 border-b border-border/50">
			<h2 className="text-sm font-semibold text-foreground mb-3">
				About
			</h2>
			<EditableField
				value={about || ""}
				onSave={onUpdate}
				isEditing={isEditing}
				placeholder="Write a short bio about yourself..."
				className="text-sm text-muted-foreground leading-relaxed"
				multiline
				as="p"
			/>
		</div>
	);
}
