"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ErrorDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	error: string | null;
}

export function ErrorDialog({
	open,
	onOpenChange,
	title = "Error Encountered",
	error,
}: ErrorDialogProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (error) {
			try {
				await navigator.clipboard.writeText(error);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error("Failed to copy:", err);
			}
		}
	};

	if (!error) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md border-destructive/50">
				<DialogHeader>
					<div className="flex items-center gap-2 text-destructive">
						<AlertCircle className="h-5 w-5" />
						<DialogTitle>{title}</DialogTitle>
					</div>
					<DialogDescription>
						Please review the error details below.
					</DialogDescription>
				</DialogHeader>

				<div className="relative mt-2">
					<div className="p-4 pr-10 rounded-md bg-muted border font-mono text-xs text-foreground/90 break-words whitespace-pre-wrap max-h-[300px] overflow-y-auto">
						{error}
					</div>
					<div className="absolute top-2 right-2">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8 hover:bg-background/80"
							onClick={handleCopy}
							title="Copy Error Message"
						>
							{copied ? (
								<Check className="h-4 w-4 text-green-500" />
							) : (
								<Copy className="h-4 w-4 text-muted-foreground" />
							)}
						</Button>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={() => onOpenChange(false)}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
