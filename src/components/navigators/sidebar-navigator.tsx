"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "./navigation-links";

export function SidebarNavigator() {
	const pathname = usePathname();

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
								? "text-foreground font-semibold bg-muted/40"
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
		</nav>
	);
}
