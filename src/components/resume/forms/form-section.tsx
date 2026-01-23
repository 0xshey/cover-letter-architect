"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface FormSectionProps {
	title: string;
	children: React.ReactNode;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
	className?: string;
	description?: string;
	rightElement?: React.ReactNode; // For "Add" button or similar actions
}

export function FormSection({
	title,
	children,
	isOwner,
	isVisible = true,
	onToggleVisibility,
	className,
	description,
	rightElement,
}: FormSectionProps) {
	// If not owner (editing) and hidden, don't show at all
	if (!isOwner && !isVisible) {
		return null;
	}

	return (
		<section
			className={cn(
				"w-full bg-muted/30 p-4 rounded-xl border space-y-2 transition-all",
				!isVisible && "opacity-50 grayscale border-dashed",
				className
			)}
		>
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<h2 className="text-md font-semibold tracking-tight">
							{title}
						</h2>
					</div>
					{description && (
						<p className="text-sm text-muted-foreground">
							{description}
						</p>
					)}
				</div>
				<div className="flex items-center gap-2">
					{isOwner && onToggleVisibility && (
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"gap-2",
								!isVisible && "text-muted-foreground"
							)}
							onClick={() => onToggleVisibility(!isVisible)}
							title={isVisible ? "Hide section" : "Show section"}
						>
							{isVisible ? (
								<>
									<Eye className="h-4 w-4" />
									<span className="sr-only">Hide</span>
								</>
							) : (
								<>
									<EyeOff className="h-4 w-4" />
									<span className="sr-only">Show</span>
								</>
							)}
						</Button>
					)}
					{rightElement}
				</div>
			</div>

			{children}
		</section>
	);
}
