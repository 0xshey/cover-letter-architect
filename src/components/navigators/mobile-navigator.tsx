"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "./navigation-links";
import { UserMenu } from "@/components/user-menu";

export function MobileNavigator() {
	const pathname = usePathname();

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

			<UserMenu
				side="top"
				align="end"
				className="flex-1 flex flex-col items-center justify-center h-full gap-1 p-1 rounded-none hover:bg-transparent hover:text-foreground text-muted-foreground w-auto py-0"
			/>
		</nav>
	);
}
