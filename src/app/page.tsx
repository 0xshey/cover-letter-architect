"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Wand2, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
	const supabase = createClient();
	const [user, setUser] = useState<any>(null);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
		};
		checkUser();

		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
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
		<div className="flex flex-col min-h-screen font-geometric text-gray-900 bg-[#f8f9fa] selection:bg-orange-200">
			{/* Background Gradients */}
			<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
				<div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-200/40 blur-[120px] mix-blend-multiply" />
				<div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-100/60 blur-[100px] mix-blend-multiply" />
				<div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-100/50 blur-[100px] mix-blend-multiply" />
			</div>

			<header
				className={cn(
					"fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300",
					scrolled
						? "bg-white/80 backdrop-blur-md border-b border-gray-100/50 py-3"
						: "bg-transparent",
				)}
			>
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white shadow-lg shadow-gray-200">
						<FileText className="w-4 h-4" />
					</div>
					<span className="text-lg font-semibold tracking-tight">
						Architect
					</span>
				</div>
				<nav className="flex items-center gap-4">
					{user ? (
						<Link href="/letters">
							<Button
								variant="ghost"
								className="font-medium hover:bg-gray-100/50"
							>
								Dashboard
							</Button>
						</Link>
					) : (
						<>
							<Button
								variant="ghost"
								onClick={handleSignIn}
								className="hidden sm:inline-flex hover:bg-gray-100/50"
							>
								Sign In
							</Button>
							<Button
								onClick={handleSignIn}
								className="rounded-full px-6 shadow-lg shadow-gray-200 transition-all hover:shadow-xl hover:scale-105 bg-gray-900 text-white hover:bg-gray-800"
							>
								Get Started
							</Button>
						</>
					)}
				</nav>
			</header>

			<main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center pt-32 pb-20">
				{/* Pill Badge */}
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-1.5 text-sm font-medium text-gray-600 backdrop-blur-md shadow-sm transition-transform hover:scale-105 cursor-default">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
					</span>
					Powered by advanced AI models
				</div>

				{/* Hero Heading */}
				<h1 className="max-w-4xl mx-auto font-serif text-6xl md:text-7xl lg:text-8xl tracking-tight text-gray-900 leading-[0.9] mb-8 drop-shadow-sm">
					Stop struggling with <br className="hidden md:block" />
					your{" "}
					<span className="italic text-gray-600">cover letter</span>.
				</h1>

				{/* Subheading */}
				<p className="max-w-xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed mb-10 font-light">
					Tailored to pass ATS checks and capture attention. Generate,
					edit, and export perfect cover letters in seconds, not
					hours.
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
					{user ? (
						<Link href="/letters">
							<Button
								size="lg"
								className="h-14 px-8 rounded-full text-lg shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 transition-all hover:-translate-y-1 bg-gray-900 text-white hover:bg-gray-800"
							>
								<Wand2 className="mr-2 h-5 w-5" />
								Go to Dashboard
							</Button>
						</Link>
					) : (
						<Button
							size="lg"
							onClick={handleSignIn}
							className="h-14 px-8 rounded-full text-lg shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 transition-all hover:-translate-y-1 bg-gray-900 text-white hover:bg-gray-800"
						>
							<div className="flex items-center gap-2">
								<span className="mr-1">✨</span>
								Create Your First Letter
							</div>
						</Button>
					)}
					<Button
						variant="ghost"
						size="lg"
						className="h-14 px-8 rounded-full text-lg hover:bg-white/50 hover:text-gray-900 transition-all text-gray-600"
					>
						View Examples
					</Button>
				</div>

				{/* Feature List / Social Proof */}
				<div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-3xl mx-auto opacity-80">
					{[
						"ATS-Friendly Formatting",
						"Natural Language AI",
						"LaTeX & PDF Export",
					].map((feature, i) => (
						<div
							key={i}
							className="flex items-center gap-3 text-gray-600 font-medium"
						>
							<div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
								<CheckCircle2 className="w-3.5 h-3.5" />
							</div>
							{feature}
						</div>
					))}
				</div>

				{/* Floating UI Mockup (Optional) */}
				<div className="mt-20 relative w-full max-w-5xl mx-auto perspective-[2000px] group">
					<div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />
					<div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 md:p-10 transform rotate-x-[10deg] transition-transform duration-700 hover:rotate-x-0">
						<div className="flex items-center gap-4 mb-6 border-b border-gray-200/50 pb-4">
							<div className="w-3 h-3 rounded-full bg-red-400/80" />
							<div className="w-3 h-3 rounded-full bg-yellow-400/80" />
							<div className="w-3 h-3 rounded-full bg-green-400/80" />
							<div className="w-full h-2 rounded-full bg-gray-100/50 max-w-[200px] ml-4" />
						</div>
						<div className="space-y-4">
							<div className="h-8 bg-gray-200/50 w-3/4 rounded-lg animate-pulse" />
							<div className="h-4 bg-gray-100/50 w-full rounded animate-pulse delay-75" />
							<div className="h-4 bg-gray-100/50 w-full rounded animate-pulse delay-100" />
							<div className="h-4 bg-gray-100/50 w-5/6 rounded animate-pulse delay-150" />
						</div>
					</div>
				</div>
			</main>

			<footer className="relative z-10 py-8 text-center text-sm text-gray-500 font-medium">
				<p>
					© {new Date().getFullYear()} Cover Letter Architect. Crafted
					with care.
				</p>
			</footer>
		</div>
	);
}
