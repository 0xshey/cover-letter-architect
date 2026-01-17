"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
	const supabase = createClient();

	const handleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
				scopes: "openid profile email https://www.googleapis.com/auth/generative-language.retriever",
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center space-y-8">
			<div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
				<Lock className="h-8 w-8 text-muted-foreground" />
			</div>
			<div className="space-y-4 max-w-[450px]">
				<h1 className="text-2xl font-bold tracking-tight">
					Access Restricted
				</h1>
				<p className="text-muted-foreground">
					You need to be signed in to access your dashboard and cover
					letters. Please sign in to continue.
				</p>
			</div>
			<div className="flex flex-col gap-4 w-full max-w-[300px]">
				<Button onClick={handleSignIn} size="lg" className="w-full">
					Sign In with Google
				</Button>
				<Button variant="ghost" asChild className="w-full">
					<Link href="/">Back to Home</Link>
				</Button>
			</div>
		</div>
	);
}
