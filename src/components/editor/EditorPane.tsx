"use client";

import { useAppStore } from "@/store/useAppStore";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SuggestionOverlay } from "./SuggestionTooltip";

export function EditorPane() {
	const {
		currentLetter,
		setCurrentLetter,
		suggestionsMode,
		toggleSuggestionsMode,
	} = useAppStore();

	return (
		<div className="h-full flex flex-col relative w-full">
			<div className="w-full flex items-center justify-start px-4 py-2 bg-muted border-b">
				<div className="flex items-center space-x-2">
					<Switch
						id="suggestions-mode"
						checked={suggestionsMode}
						onCheckedChange={toggleSuggestionsMode}
					/>
					<Label
						htmlFor="suggestions-mode"
						className="text-xs cursor-pointer text-muted-foreground"
					>
						Suggestions Mode
					</Label>
				</div>
			</div>
			<div className="flex-1 relative w-full h-full">
				<SuggestionOverlay text={currentLetter || ""} />
				<Textarea
					value={currentLetter || ""}
					onChange={(e) => setCurrentLetter(e.target.value)}
					className="h-full w-full resize-none p-4 font-sans text-xs leading-relaxed border-0 focus-visible:ring-0 rounded-none bg-transparent"
					placeholder="Content will appear here after generation..."
					spellCheck={false}
				/>
			</div>
		</div>
	);
}
