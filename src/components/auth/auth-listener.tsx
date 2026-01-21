"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthListener() {
	const supabase = createClient();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
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
