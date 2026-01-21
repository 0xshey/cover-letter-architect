import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGenerativeStore } from "@/store/useGenerativeStore";

export function useGenerativeModel() {
	const { session } = useAuthStore();
	const {
		selectedModel,
		setSelectedModel,
		availableModels,
		setAvailableModels,
		isLoadingModels,
		setIsLoadingModels,
		isGenerating,
		setIsGenerating,
	} = useGenerativeStore();

	useEffect(() => {
		if (session && availableModels.length === 0 && !isLoadingModels) {
			fetchModels();
		}
	}, [session, availableModels.length, isLoadingModels]);

	// Auto-select flash model if nothing selected
	useEffect(() => {
		if (availableModels.length > 0 && !selectedModel) {
			// Prefer "flash" models, then fall back to the first available
			const flashModel = availableModels.find((m) =>
				m.id.includes("flash")
			);
			if (flashModel) {
				setSelectedModel(flashModel.id);
			} else {
				setSelectedModel(availableModels[0].id);
			}
		}
	}, [availableModels, selectedModel, setSelectedModel]);

	const fetchModels = async () => {
		setIsLoadingModels(true);
		try {
			const res = await fetch("/api/models");
			if (res.ok) {
				const data = await res.json();
				if (data.models && data.models.length > 0) {
					setAvailableModels(data.models);
				}
			}
		} catch (error) {
			console.error("Failed to fetch models", error);
		} finally {
			setIsLoadingModels(false);
		}
	};

	return {
		session,
		selectedModel,
		setSelectedModel,
		availableModels,
		isLoadingModels,
		isGenerating,
		setIsGenerating, // Exporting this so Canvas can set it
		fetchModels,
	};
}
