"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Wand2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function LandingPage() {
	const supabase = createClient();
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
		};
		checkUser();
	}, [supabase]);

	const handleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
				scopes: "openid profile email https://www.googleapis.com/auth/generative-language.retriever",
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});
	};

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<header className="px-6 h-14 flex items-center border-b">
				<Link className="flex items-center justify-center" href="#">
					<FileText className="h-6 w-6 mr-2" />
					<span className="font-bold">Cover Letter Architect</span>
				</Link>
				<nav className="ml-auto flex gap-4 sm:gap-6">
					{user ? (
						<Link href="/letters">
							<Button variant="ghost" size="sm">
								Go to Letters
							</Button>
						</Link>
					) : (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSignIn}
						>
							Sign In
						</Button>
					)}
				</nav>
			</header>
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Craft the Perfect Cover Letter
								</h1>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
									Tailored to pass ATS checks. Powered by AI.
									Manage multiple versions and export to
									LaTeX/PDF.
								</p>
							</div>
							<div className="space-x-4">
								{user ? (
									<Link href="/letters">
										<Button size="lg">
											<Wand2 className="mr-2 h-4 w-4" />
											Go to Letters
										</Button>
									</Link>
								) : (
									<Button size="lg" onClick={handleSignIn}>
										<Wand2 className="mr-2 h-4 w-4" />
										Get Started
									</Button>
								)}
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
