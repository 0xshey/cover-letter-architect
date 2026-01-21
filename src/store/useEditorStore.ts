import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GeneratedLetter } from "@/types";

interface EditorState {
	currentCoverLetterId: string | null;
	setCurrentCoverLetterId: (id: string | null) => void;
	currentLetter: string | null;
	setCurrentLetter: (letter: string | null) => void;
	savedLetters: GeneratedLetter[];
	saveLetter: (letter: GeneratedLetter) => void;
	resetEditor: () => void;
	clearHistory: () => void;
}

export const useEditorStore = create<EditorState>()(
	persist(
		(set) => ({
			currentCoverLetterId: null,
			setCurrentCoverLetterId: (id) => set({ currentCoverLetterId: id }),
			currentLetter: null,
			setCurrentLetter: (letter) => set({ currentLetter: letter }),
			savedLetters: [],
			saveLetter: (letter) =>
				set((state) => ({
					savedLetters: [letter, ...state.savedLetters],
				})),
			resetEditor: () =>
				set({
					currentCoverLetterId: null,
					currentLetter: null,
				}),
			clearHistory: () => set({ savedLetters: [] }),
		}),
		{
			name: "editor-storage",
			partialize: (state) => ({
				currentCoverLetterId: state.currentCoverLetterId,
				currentLetter: state.currentLetter,
				savedLetters: state.savedLetters,
			}),
		}
	)
);
