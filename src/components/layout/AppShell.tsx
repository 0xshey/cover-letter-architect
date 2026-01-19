"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "./AppNavigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppShellProps {
	children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	const pathname = usePathname();
	const supabase = createClient();
	const [session, setSession] = useState<any>(null);

	// Hide AppShell on landing page
	const isLandingPage = pathname === "/";

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		window.location.href = "/";
	};

	if (isLandingPage) {
		return <>{children}</>;
	}

	return (
		<div className="flex min-h-screen flex-col md:flex-row bg-background">
			{/* Desktop Sidebar (Left) */}
			<aside className="hidden md:flex w-[72px] lg:w-[244px] flex-col border-r fixed left-0 top-0 h-full z-40 bg-background transition-all duration-300">
				{/* Top: Logo */}
				<div className="p-4 lg:p-6 shrink-0">
					<Link
						href="/dashboard"
						className="flex items-center justify-center lg:justify-start hover:opacity-80 transition-opacity"
					>
						<FileText className="h-8 w-8 text-foreground" />
					</Link>
				</div>

				{/* Center: Navigation */}
				<div className="flex-1 flex flex-col justify-center w-full">
					<nav className="flex flex-col gap-2 px-3">
						{NAVIGATION_ITEMS.map((item) => {
							const isActive = item.match(pathname);
							const Icon = item.icon;
							return (
								<Link
									key={item.path}
									href={item.path}
									className={cn(
										"flex items-center p-3 rounded-2xl transition-all duration-200 group w-full",
										isActive
											? "text-foreground font-semibold"
											: "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
									)}
								>
									<div className="flex items-center justify-center w-10 h-10 lg:w-auto lg:h-auto lg:justify-start">
										<Icon
											className={cn(
												"h-7 w-7 lg:mr-4 transition-transform group-hover:scale-105",
												isActive
													? "fill-foreground"
													: ""
											)}
											strokeWidth={isActive ? 2.5 : 2}
										/>
									</div>
									<span className="hidden lg:inline text-lg">
										{item.label}
									</span>
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Bottom: Logout / Menu */}
				{session && (
					<div className="p-4 lg:p-6 shrink-0 mt-auto">
						<div className="relative">
							<Button
								variant="ghost"
								className="w-full h-auto py-3 justify-center lg:justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 group rounded-2xl"
								onClick={handleSignOut}
								title="Sign Out"
							>
								<LogOut className="h-6 w-6 lg:mr-3" />
								<span className="hidden lg:inline text-md font-medium">
									Log out
								</span>
							</Button>
						</div>
					</div>
				)}
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 md:ml-[72px] lg:ml-[244px] pb-16 md:pb-0 min-w-0">
				{children}
			</main>

			{/* Mobile Bottom Bar */}
			<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t z-50 flex items-center justify-around px-2 pb-safe">
				{NAVIGATION_ITEMS.map((item) => {
					const isActive = item.match(pathname);
					const Icon = item.icon;
					return (
						<Link
							key={item.path}
							href={item.path}
							className={cn(
								"flex-1 flex flex-col items-center justify-center h-full gap-1 p-1 transition-colors",
								isActive
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							<Icon
								className={cn(
									"h-6 w-6",
									isActive ? "fill-foreground" : ""
								)}
								strokeWidth={isActive ? 2.5 : 2}
							/>
						</Link>
					);
				})}
				{/* Mobile Logout or Menu trigger (Simplified) */}
				<button
					onClick={handleSignOut}
					className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground hover:text-destructive"
				>
					<LogOut className="h-6 w-6" />
				</button>
			</nav>
		</div>
	);
}
