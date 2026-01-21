import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GenerativeState {
	selectedModel: string;
	setSelectedModel: (model: string) => void;
	availableModels: { id: string; name: string }[];
	setAvailableModels: (models: { id: string; name: string }[]) => void;
	isLoadingModels: boolean;
	setIsLoadingModels: (isLoading: boolean) => void;
	isGenerating: boolean;
	setIsGenerating: (isGenerating: boolean) => void;
}

export const useGenerativeStore = create<GenerativeState>()(
	persist(
		(set) => ({
			selectedModel: "",
			setSelectedModel: (model) => set({ selectedModel: model }),
			availableModels: [],
			setAvailableModels: (models) => set({ availableModels: models }),
			isLoadingModels: false,
			setIsLoadingModels: (isLoading) =>
				set({ isLoadingModels: isLoading }),
			isGenerating: false,
			setIsGenerating: (isGenerating) => set({ isGenerating }),
		}),
		{
			name: "generative-model-storage",
			partialize: (state) => ({
				selectedModel: state.selectedModel,
			}),
		}
	)
);
