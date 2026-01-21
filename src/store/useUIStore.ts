import { create } from "zustand";

interface UIState {
	suggestionsMode: boolean;
	toggleSuggestionsMode: () => void;
	activeMobileView: "sidebar" | "workspace";
	setActiveMobileView: (view: "sidebar" | "workspace") => void;
}

export const useUIStore = create<UIState>((set) => ({
	suggestionsMode: false,
	toggleSuggestionsMode: () =>
		set((state) => ({ suggestionsMode: !state.suggestionsMode })),
	activeMobileView: "sidebar",
	setActiveMobileView: (view) => set({ activeMobileView: view }),
}));
