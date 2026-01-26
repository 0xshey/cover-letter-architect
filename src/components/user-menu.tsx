"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { LogOut, Monitor, Moon, Sun, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
	className?: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
}

export function UserMenu({
	className,
	side = "right",
	align = "end",
	sideOffset = 10,
}: UserMenuProps) {
	const { session } = useAuthStore();
	const { setTheme } = useTheme();
	const supabase = createClient();

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			window.location.href = "/";
		} catch (error) {
			console.error(error);
			toast.error("Failed to sign out");
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className={cn(
						"w-full h-auto p-2 justify-center text-muted-foreground hover:bg-muted group rounded-2xl",
						className,
					)}
					title="Menu"
				>
					<MoreHorizontal className="h-6 w-6" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={align}
				side={side}
				className="w-56"
				sideOffset={sideOffset}
			>
				{session?.user?.email && (
					<>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									Account
								</p>
								<p className="text-xs leading-none text-muted-foreground truncate">
									{session.user.email}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="ml-2">Theme</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setTheme("light")}>
								<Sun className="mr-2 h-4 w-4" />
								<span>Light</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								<Moon className="mr-2 h-4 w-4" />
								<span>Dark</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme("system")}
							>
								<Monitor className="mr-2 h-4 w-4" />
								<span>System</span>
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>

				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleSignOut}
					className="text-destructive focus:text-destructive"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
