import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session } from "@supabase/supabase-js";

interface AuthState {
	session: Session | null;
	setSession: (session: Session | null) => void;
	clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			session: null,
			setSession: (session) => set({ session }),
			clearSession: () => set({ session: null }),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ session: state.session }),
		}
	)
);
