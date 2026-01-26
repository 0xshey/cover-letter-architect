"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor"; // Added import
import { cn } from "@/lib/utils";

interface ResumeFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	isOwner: boolean;
	placeholder?: string;
	variant?: "primary" | "secondary" | "textarea" | "richtext"; // Added richtext
	className?: string;
	InputClassName?: string;
	onBlur?: () => void;
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
	onBlur,
}: ResumeFieldProps) {
	const isTextarea = variant === "textarea";
	const isPrimary = variant === "primary";

	const isEmpty = !value || value.trim() === "";

	return (
		<div
			className={cn(
				"space-y-1",
				className,
				!isOwner && isEmpty && "hidden",
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
					onBlur={onBlur}
					className={cn(
						"bg-transparent text-base border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[80px] px-0 shadow-none disabled:opacity-100 placeholder:text-muted-foreground/40",
						"text-muted-foreground",
						isOwner &&
							"ring ring-ring/20 bg-muted/20 rounded-lg px-3 py-2 mt-2",
						InputClassName,
					)}
					placeholder={isOwner ? placeholder : undefined}
					disabled={!isOwner}
				/>
			) : variant === "richtext" ? (
				isOwner ? (
					<div className="mt-2">
						<RichTextEditor
							content={value || ""}
							onChange={onChange}
							className={cn(
								"min-h-[150px] ring ring-ring/20 bg-muted/20 rounded-lg",
								InputClassName,
							)}
						/>
					</div>
				) : (
					<div
						className={cn(
							"prose prose-sm dark:prose-invert max-w-none text-muted-foreground mt-1",
							"[&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-4",
							"[&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-4",
							"[&_p]:leading-relaxed [&_p]:my-2",
							InputClassName,
						)}
						dangerouslySetInnerHTML={{ __html: value || "" }}
					/>
				)
			) : (
				<Input
					value={value || ""}
					onChange={(e) => onChange(e.target.value)}
					onBlur={onBlur}
					variant="ghost"
					className={cn(
						"px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors shadow-none h-auto py-1 disabled:opacity-100 placeholder:text-muted-foreground/40",
						isOwner &&
							"ring ring-ring/20 bg-muted/20 rounded-lg px-3 py-2 mt-2",
						isPrimary
							? "text-foreground font-medium"
							: "text-muted-foreground",
						InputClassName,
					)}
					placeholder={isOwner ? placeholder : undefined}
					disabled={!isOwner}
				/>
			)}
		</div>
	);
}
