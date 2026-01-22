"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader, Google } from "lucide-react";

const OAuthLogin: React.FC = ({}) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const supabase = createClient();

	async function oauthSignIn() {
		try {
			setIsLoading(true);
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				throw error;
			}
		} catch (error) {
			setIsLoading(false);
			console.error(error);
			toast.error("Failed to sign in with Google. Please try again.");
		}
	}
	return (
		<Button
			aria-label={`Continue with Google`}
			variant="outline"
			className="bg-transparent flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none h-16 w-full text-base hover:bg-transparent border-[#333333] text-white hover:text-white"
			onClick={() => void oauthSignIn()}
			disabled={isLoading}
		>
			{isLoading ? (
				<Loader
					className="mr-2 h-4 w-4 animate-spin"
					aria-hidden="true"
				/>
			) : (
				<Google className="mr-2 h-4 w-4" aria-hidden="true" />
			)}
			Continue with Google
		</Button>
	);
};

export default OAuthLogin;
