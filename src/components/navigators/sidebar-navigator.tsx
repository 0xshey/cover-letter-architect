"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "./navigation-links";

export function SidebarNavigator() {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-6 p-1 rounded-2xl">
			{NAVIGATION_ITEMS.map((item) => {
				const isActive = item.match(pathname);
				const Icon = item.icon;
				return (
					<Link
						key={item.path}
						href={item.path}
						className={cn(
							"flex items-center justify-center aspect-square rounded-xl transition-all duration-200 group",
							isActive
								? "text-foreground font-semibold bg-muted/40"
								: "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
						)}
					>
						<div className="flex items-center justify-center w-8 h-8 ">
							<Icon
								className={cn(
									"h-6 w-6 transition-transform group-hover:scale-105",
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
