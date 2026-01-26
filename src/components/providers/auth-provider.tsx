"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const supabase = createClient();
	const { setSession, setIsLoading } = useAuthStore();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (session) {
				setSession(session);
			} else {
				setSession(null);
			}
			setIsLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase, setSession, setIsLoading]);

	return <>{children}</>;
}
