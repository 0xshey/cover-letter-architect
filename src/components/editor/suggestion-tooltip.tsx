"use client";

import React from "react";
import { useUIStore } from "@/store/useUIStore";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// A mock list of weak phrases to detect
const WEAK_PHRASES = [
	{
		phrase: "hard worker",
		suggestion: "dedicated professional with a strong work ethic",
	},
	{
		phrase: "think outside the box",
		suggestion: "approach problems creatively",
	},
	{ phrase: "team player", suggestion: "collaborative contributor" },
	{
		phrase: "responsible for",
		suggestion: "spearheaded / managed / executed",
	},
	{ phrase: "very good", suggestion: "exceptional / proficient / skilled" },
];

export function SuggestionOverlay({ text }: { text: string }) {
	const { suggestionsMode } = useUIStore();

	if (!suggestionsMode || !text) return null;

	let parts: (string | React.ReactNode)[] = [text];

	WEAK_PHRASES.forEach(({ phrase, suggestion }) => {
		const newParts: (string | React.ReactNode)[] = [];
		parts.forEach((part) => {
			if (typeof part === "string") {
				const regex = new RegExp(`(${phrase})`, "gi");
				const split = part.split(regex);
				split.forEach((s, i) => {
					if (s.toLowerCase() === phrase.toLowerCase()) {
						newParts.push(
							<TooltipProvider key={i}>
								<Tooltip delayDuration={0}>
									<TooltipTrigger asChild>
										<span className="bg-yellow-200 dark:bg-yellow-900/50 cursor-help border-b-2 border-yellow-500">
											{s}
										</span>
									</TooltipTrigger>
									<TooltipContent className="max-w-xs bg-indigo-950 text-white border-indigo-800">
										<p className="font-semibold text-xs mb-1">
											Suggestion:
										</p>
										<p>{suggestion}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						);
					} else {
						newParts.push(s);
					}
				});
			} else {
				newParts.push(part);
			}
		});
		parts = newParts;
	});

	return (
		<div className="absolute inset-0 p-6 font-mono text-sm leading-relaxed pointer-events-none whitespace-pre-wrap z-10 text-transparent">
			{/* We render the highlights but keep text transparent so check spelling/layout matches textarea */}
			{parts.map((part, i) => (
				<React.Fragment key={i}>
					{typeof part === "string" ? (
						part
					) : (
						<span className="pointer-events-auto inline-block">
							{part}
						</span>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
