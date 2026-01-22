"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Pencil } from "lucide-react";

interface EditableFieldProps {
	value: string;
	onSave: (value: string) => void;
	isEditing: boolean;
	placeholder?: string;
	className?: string;
	inputClassName?: string;
	multiline?: boolean;
	as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function EditableField({
	value,
	onSave,
	isEditing,
	placeholder = "Click to edit",
	className,
	inputClassName,
	multiline = false,
	as: Component = "span",
}: EditableFieldProps) {
	const [isActive, setIsActive] = useState(false);
	const [editValue, setEditValue] = useState(value);
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

	useEffect(() => {
		setEditValue(value);
	}, [value]);

	useEffect(() => {
		if (isActive && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isActive]);

	const handleSave = () => {
		onSave(editValue);
		setIsActive(false);
	};

	const handleCancel = () => {
		setEditValue(value);
		setIsActive(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !multiline) {
			e.preventDefault();
			handleSave();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	if (!isEditing) {
		return (
			<Component className={className}>
				{value || (
					<span className="text-muted-foreground">{placeholder}</span>
				)}
			</Component>
		);
	}

	if (isActive) {
		const InputComponent = multiline ? "textarea" : "input";
		return (
			<div className="flex items-start gap-2">
				<InputComponent
					ref={
						inputRef as React.RefObject<
							HTMLInputElement & HTMLTextAreaElement
						>
					}
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					onKeyDown={handleKeyDown}
					className={cn(
						"flex-1 bg-transparent border-b border-primary/50 focus:border-primary outline-none",
						multiline && "min-h-[80px] resize-y",
						inputClassName
					)}
					placeholder={placeholder}
				/>
				<button
					onClick={handleSave}
					className="p-1 text-green-600 hover:text-green-700 transition-colors"
					title="Save"
				>
					<Check className="h-4 w-4" />
				</button>
				<button
					onClick={handleCancel}
					className="p-1 text-destructive hover:text-destructive/80 transition-colors"
					title="Cancel"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}

	return (
		<button
			onClick={() => setIsActive(true)}
			className={cn(
				"group flex items-center gap-2 text-left hover:bg-muted/50 rounded px-1 -mx-1 transition-colors",
				className
			)}
		>
			<Component className="flex-1">
				{value || (
					<span className="text-muted-foreground">{placeholder}</span>
				)}
			</Component>
			<Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
		</button>
	);
}
