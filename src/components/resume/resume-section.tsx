"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface ResumeSectionProps {
	title: string;
	children: ReactNode;
	isVisible?: boolean;
	onToggleVisibility?: () => void;
	isEditing?: boolean;
	className?: string;
}

export function ResumeSection({
	title,
	children,
	isVisible = true,
	onToggleVisibility,
	isEditing = false,
	className,
}: ResumeSectionProps) {
	// When editing, always show section (but dimmed if hidden)
	// When viewing, hide if not visible
	if (!isVisible && !isEditing) {
		return null;
	}

	return (
		<section
			className={cn(
				"py-6 first:pt-0",
				!isVisible && isEditing && "opacity-50",
				className
			)}
		>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-sm font-semibold text-foreground">
					{title}
				</h2>
				{isEditing && onToggleVisibility && (
					<div className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground">
							{isVisible ? "Visible" : "Hidden"}
						</span>
						<Switch
							checked={isVisible}
							onCheckedChange={onToggleVisibility}
							className="scale-75"
						/>
					</div>
				)}
			</div>
			{children}
		</section>
	);
}
