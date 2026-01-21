import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TargetInfo } from "@/types";

const defaultTargetInfo: TargetInfo = {
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
};

interface TargetState {
	targetInfo: TargetInfo;
	setTargetInfo: (info: Partial<TargetInfo>) => void;
	resetTargetInfo: () => void;
}

export const useTargetStore = create<TargetState>()(
	persist(
		(set) => ({
			targetInfo: defaultTargetInfo,
			setTargetInfo: (info) =>
				set((state) => ({
					targetInfo: { ...state.targetInfo, ...info },
				})),
			resetTargetInfo: () => set({ targetInfo: defaultTargetInfo }),
		}),
		{
			name: "target-storage",
			partialize: (state) => ({ targetInfo: state.targetInfo }),
		}
	)
);
