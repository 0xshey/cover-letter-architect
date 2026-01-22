"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import { UserMenu } from "@/components/user-menu";
import { useAuthStore } from "@/store/useAuthStore";

interface NavigatorProps {
	mode: "desktop" | "mobile";
}

export function Navigator({ mode }: NavigatorProps) {
	const pathname = usePathname();
	const { session } = useAuthStore();
	const userId = session?.user?.id;

	// Resume link (dynamic based on user)
	const resumeLink = userId
		? {
				icon: User,
				label: "Resume",
				path: `/resume/${userId}`,
				match: (path: string) => path.startsWith("/resume"),
		  }
		: null;

	if (mode === "desktop") {
		return (
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
							<div className="flex items-center justify-center w-10 h-10 ">
								<Icon
									className={cn(
										"h-7 w-7 transition-transform group-hover:scale-105"
									)}
									strokeWidth={isActive ? 2.5 : 2}
								/>
							</div>
						</Link>
					);
				})}

				{/* Resume Link */}
				{resumeLink && (
					<Link
						href={resumeLink.path}
						className={cn(
							"flex items-center p-3 rounded-2xl transition-all duration-200 group w-full",
							resumeLink.match(pathname)
								? "text-foreground font-semibold"
								: "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
						)}
					>
						<div className="flex items-center justify-center w-10 h-10">
							<User
								className="h-7 w-7 transition-transform group-hover:scale-105"
								strokeWidth={
									resumeLink.match(pathname) ? 2.5 : 2
								}
							/>
						</div>
					</Link>
				)}
			</nav>
		);
	}

	// Mobile Navigator
	return (
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

			{/* Resume Link (Mobile) */}
			{resumeLink && (
				<Link
					href={resumeLink.path}
					className={cn(
						"flex-1 flex flex-col items-center justify-center h-full gap-1 p-1 transition-colors",
						resumeLink.match(pathname)
							? "text-foreground"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					<User
						className={cn(
							"h-6 w-6",
							resumeLink.match(pathname) ? "fill-foreground" : ""
						)}
						strokeWidth={resumeLink.match(pathname) ? 2.5 : 2}
					/>
				</Link>
			)}

			<UserMenu
				side="top"
				align="end"
				className="flex-1 flex flex-col items-center justify-center h-full gap-1 p-1 rounded-none hover:bg-transparent hover:text-foreground text-muted-foreground w-auto py-0"
			/>
		</nav>
	);
}
