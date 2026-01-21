"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import { useAuthStore } from "@/store/useAuthStore";

export function AuthListener() {
	const supabase = createClient();
	const { setSession } = useAuthStore();

	useEffect(() => {
		// Initialize session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
			if (event === "SIGNED_OUT") {
				window.location.href = "/";
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase]);

	return null;
}
