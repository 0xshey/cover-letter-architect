"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ResumeFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	isOwner: boolean;
	placeholder?: string;
	variant?: "primary" | "secondary" | "textarea";
	className?: string;
	InputClassName?: string;
}

export function ResumeField({
	label,
	value,
	onChange,
	isOwner,
	placeholder,
	variant = "secondary",
	className,
	InputClassName,
}: ResumeFieldProps) {
	const isTextarea = variant === "textarea";
	const isPrimary = variant === "primary";

	const isEmpty = !value || value.trim() === "";

	return (
		<div
			className={cn(
				"space-y-1",
				className,
				!isOwner && isEmpty && "hidden"
			)}
		>
			{isOwner && (
				<Label className="text-base text-muted-foreground font-normal">
					{label}
				</Label>
			)}

			{isTextarea ? (
				<Textarea
					value={value || ""}
					onChange={(e) => onChange(e.target.value)}
					className={cn(
						"bg-transparent text-base border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[80px] px-0 shadow-none disabled:opacity-100 placeholder:text-muted-foreground/40",
						"text-muted-foreground",
						isOwner &&
							"ring ring-ring/20 bg-muted/20 rounded-lg px-3 py-2 mt-2",
						InputClassName
					)}
					placeholder={isOwner ? placeholder : undefined}
					disabled={!isOwner}
				/>
			) : (
				<Input
					value={value || ""}
					onChange={(e) => onChange(e.target.value)}
					variant="ghost"
					className={cn(
						"px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors shadow-none h-auto py-1 disabled:opacity-100 placeholder:text-muted-foreground/40",
						isOwner &&
							"ring ring-ring/20 bg-muted/20 rounded-lg px-3 py-2 mt-2",
						isPrimary
							? "text-foreground font-medium"
							: "text-muted-foreground",
						InputClassName
					)}
					placeholder={isOwner ? placeholder : undefined}
					disabled={!isOwner}
				/>
			)}
		</div>
	);
}
