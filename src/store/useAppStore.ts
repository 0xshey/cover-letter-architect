import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContentBlock, TargetInfo, GeneratedLetter } from "@/types";
import { Session } from "@supabase/supabase-js";

interface AppState {
	// auth
	session: Session | null;
	setSession: (session: Session | null) => void;

	currentCoverLetterId: string | null;
	setCurrentCoverLetterId: (id: string | null) => void;

	// content blocks
	blocks: ContentBlock[];
	setBlocks: (blocks: ContentBlock[]) => void;
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
	setCurrentLetter: (letter: string | null) => void;

	// suggestions
	suggestionsMode: boolean;
	toggleSuggestionsMode: () => void;

	// history
	savedLetters: GeneratedLetter[];
	saveLetter: (letter: GeneratedLetter) => void;

	// mobile view
	activeMobileView: "sidebar" | "workspace";
	setActiveMobileView: (view: "sidebar" | "workspace") => void;

	// reset
	clearState: () => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			session: null,
			setSession: (session) => set({ session }),

			currentCoverLetterId: null,
			setCurrentCoverLetterId: (id) => set({ currentCoverLetterId: id }),

			blocks: [],
			setBlocks: (blocks) => set({ blocks }),
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
				email: "",
				isEmailEnabled: true,
				phone: "",
				isPhoneEnabled: true,
				cityState: "",
				isCityStateEnabled: true,
				portfolioUrl: "",
				isPortfolioUrlEnabled: true,
				companyAddress: "",
				jobId: "",
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

			clearState: () =>
				set({
					session: null,
					currentCoverLetterId: null,
					blocks: [],
					targetInfo: {
						companyName: "",
						roleTitle: "",
						addressee: "",
						authorName: "",
						email: "",
						isEmailEnabled: true,
						phone: "",
						isPhoneEnabled: true,
						cityState: "",
						isCityStateEnabled: true,
						portfolioUrl: "",
						isPortfolioUrlEnabled: true,
						companyAddress: "",
						jobId: "",
					},
					currentLetter: null,
					savedLetters: [],
					selectedModel: "gemini-1.5-flash",
					isGenerating: false,
				}),
		}),
		{
			name: "cover-letter-storage",
			partialize: (state) => ({
				blocks: state.blocks,
				targetInfo: state.targetInfo,
				selectedModel: state.selectedModel,
				savedLetters: state.savedLetters,
				currentLetter: state.currentLetter,
				currentCoverLetterId: state.currentCoverLetterId,
			}), // persisting only necessary data
		}
	)
);
