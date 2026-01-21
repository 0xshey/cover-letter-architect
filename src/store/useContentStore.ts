import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContentBlock } from "@/types";

interface ContentState {
	blocks: ContentBlock[];
	setBlocks: (blocks: ContentBlock[]) => void;
	addBlock: (block: Omit<ContentBlock, "id" | "isEnabled">) => void;
	updateBlock: (id: string, updates: Partial<ContentBlock>) => void;
	removeBlock: (id: string) => void;
	toggleBlock: (id: string) => void;
	resetBlocks: () => void;
}

export const useContentStore = create<ContentState>()(
	persist(
		(set) => ({
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
			resetBlocks: () => set({ blocks: [] }),
		}),
		{
			name: "content-storage",
			partialize: (state) => ({ blocks: state.blocks }),
		}
	)
);
