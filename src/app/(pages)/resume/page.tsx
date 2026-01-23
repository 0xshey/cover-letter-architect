"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function ResumeRootPage() {
	const router = useRouter();
	const supabase = createClient();
	const { session, isLoading: isAuthLoading } = useAuthStore();
	const [checkingProfile, setCheckingProfile] = useState(true);

	useEffect(() => {
		if (isAuthLoading) return;

		if (!session) {
			router.push("/login?next=/resume");
			return;
		}

		async function checkProfile() {
			try {
				const { data: profile, error } = await supabase
					.from("profiles")
					.select("username")
					.eq("id", session!.user.id)
					.single();

				if (profile?.username) {
					router.push(`/resume/${profile.username}`);
				} else {
					router.push("/user"); // Redirect to profile setup/settings if no username
				}
			} catch (err) {
				console.error("Error checking profile:", err);
				router.push("/user");
			} finally {
				setCheckingProfile(false);
			}
		}

		checkProfile();
	}, [session, isAuthLoading, router, supabase]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	);
}
