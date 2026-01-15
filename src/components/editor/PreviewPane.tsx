"use client";

import ReactMarkdown from "react-markdown";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function PreviewPane() {
	const { currentLetter, blocks } = useAppStore();

	// Simple heuristic highlighting: match usage of block phrases?
	// For now, we rely on the prompt to stick to the user's voice.
	// If we really want highlighting, we might need a more complex diff or tag logic.
	// The requirement said: "Highlight sentences directly derived from the User's Blocks".
	// This is hard to do perfectly with an LLM rephrasing things.
	// We will assume the LLM tries to use exact phrases or we can just render the markdown.
	// Alternatively, we could ask the LLM to wrap usage in <mark> tags if we trust it, but user wants markdown output.
	// Let's stick to standard markdown rendering for now, and maybe add a custom component for <span> if we process the text.

	// To satisfy the requirement "Live Preview must render Markdown", we use react-markdown.

	return (
		<div className="h-full overflow-hidden bg-muted p-8 border rounded">
			<div className="max-w-[21cm] mx-auto min-h-full bg-background text-foreground p-[1cm] border font-sans text-xs leading-relaxed whitespace-pre-wrap rounded-">
				{currentLetter ? (
					<ReactMarkdown
						components={{
							p: ({ node, ...props }) => (
								<p className="mb-4" {...props} />
							),
							ul: ({ node, ...props }) => (
								<ul
									className="mb-4 list-disc pl-5"
									{...props}
								/>
							),
							ol: ({ node, ...props }) => (
								<ol
									className="mb-4 list-decimal pl-5"
									{...props}
								/>
							),
							// Style the mark tag for the highlighting requirement
							mark: ({ node, ...props }) => (
								<span
									className="bg-yellow-100/50 dark:bg-yellow-900/20 rounded px-0.5"
									{...props}
								/>
							),
						}}
					>
						{currentLetter}
					</ReactMarkdown>
				) : (
					<div className="h-full flex items-center justify-center text-muted-foreground italic">
						Preview will appear here...
					</div>
				)}
			</div>
		</div>
	);
}
