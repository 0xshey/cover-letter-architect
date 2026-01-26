import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session } from "@supabase/supabase-js";

interface AuthState {
	session: Session | null;
	isLoading: boolean;
	setSession: (session: Session | null) => void;
	setIsLoading: (isLoading: boolean) => void;
	clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			session: null,
			isLoading: true,
			setSession: (session) => set({ session, isLoading: false }),
			setIsLoading: (isLoading) => set({ isLoading }),
			clearSession: () => set({ session: null, isLoading: false }),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ session: state.session }),
		},
	),
);
