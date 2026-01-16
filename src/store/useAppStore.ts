import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContentBlock, TargetInfo, GeneratedLetter } from "@/types";

interface AppState {
	// content blocks
	blocks: ContentBlock[];
	addBlock: (block: Omit<ContentBlock, "id" | "isEnabled">) => void;
	updateBlock: (id: string, updates: Partial<ContentBlock>) => void;
	removeBlock: (id: string) => void;
	toggleBlock: (id: string) => void;

	// target info
	targetInfo: TargetInfo;
	setTargetInfo: (info: Partial<TargetInfo>) => void;

	// generation
	selectedModel: string;
	setSelectedModel: (model: string) => void;
	isGenerating: boolean;
	setIsGenerating: (isGenerating: boolean) => void;

	// current letter
	currentLetter: string | null; // markdown content
	setCurrentLetter: (letter: string) => void;

	// suggestions
	suggestionsMode: boolean;
	toggleSuggestionsMode: () => void;

	// history
	savedLetters: GeneratedLetter[];
	saveLetter: (letter: GeneratedLetter) => void;

	// mobile view
	activeMobileView: "sidebar" | "workspace";
	setActiveMobileView: (view: "sidebar" | "workspace") => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			blocks: [],
			addBlock: (block) =>
				set((state) => ({
					blocks: [
						...state.blocks,
						{
							...block,
							id: crypto.randomUUID(),
							isEnabled: true,
						},
					],
				})),
			updateBlock: (id, updates) =>
				set((state) => ({
					blocks: state.blocks.map((b) =>
						b.id === id ? { ...b, ...updates } : b
					),
				})),
			removeBlock: (id) =>
				set((state) => ({
					blocks: state.blocks.filter((b) => b.id !== id),
				})),
			toggleBlock: (id) =>
				set((state) => ({
					blocks: state.blocks.map((b) =>
						b.id === id ? { ...b, isEnabled: !b.isEnabled } : b
					),
				})),

			targetInfo: {
				companyName: "",
				roleTitle: "",
				addressee: "",
				authorName: "",
			},
			setTargetInfo: (info) =>
				set((state) => ({
					targetInfo: { ...state.targetInfo, ...info },
				})),

			selectedModel: "gemini-1.5-flash",
			setSelectedModel: (model) => set({ selectedModel: model }),

			isGenerating: false,
			setIsGenerating: (isGenerating) => set({ isGenerating }),

			currentLetter: null,
			setCurrentLetter: (letter) => set({ currentLetter: letter }),

			suggestionsMode: false,
			toggleSuggestionsMode: () =>
				set((state) => ({ suggestionsMode: !state.suggestionsMode })),

			savedLetters: [],
			saveLetter: (letter) =>
				set((state) => ({
					savedLetters: [letter, ...state.savedLetters],
				})),

			activeMobileView: "sidebar",
			setActiveMobileView: (view) => set({ activeMobileView: view }),
		}),
		{
			name: "cover-letter-storage",
			partialize: (state) => ({
				blocks: state.blocks,
				targetInfo: state.targetInfo,
				selectedModel: state.selectedModel,
				savedLetters: state.savedLetters,
			}), // persisting only necessary data
		}
	)
);
