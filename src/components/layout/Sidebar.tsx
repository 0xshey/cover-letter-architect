"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsDialog } from "@/components/SettingsDialog";
import { BlockList } from "@/components/blocks/BlockList";
import { TargetInfoForm } from "@/components/blocks/TargetInfo";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

import { ThemeToggle } from "@/components/ThemeToggle";
import { useAppStore } from "@/store/useAppStore";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar({ className, ...props }: SidebarProps) {
	const { setActiveMobileView } = useAppStore();

	return (
		<div className={cn("flex flex-col h-full", className)} {...props}>
			<div className="w-full flex h-14 items-center px-4 justify-between shrink-0">
				<div className="w-full flex items-center justify-center gap-2">
					<span className="font-bold tracking-tight">
						COVER LETTER ARCHITECT™
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden rounded-full bg-yellow-400 text-black"
						onClick={() => setActiveMobileView("workspace")}
						title="Go to Editor"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-hidden p-4">
				<div className="h-full flex flex-col gap-16 p-4">
					<TargetInfoForm />
					<div className="flex-1 min-h-0 relative">
						<ScrollArea className="h-full pr-4">
							<BlockList />
						</ScrollArea>
					</div>
				</div>
			</div>

			<div className=" p-4 flex justify-between items-center bg-background/50">
				<span className="text-xs text-muted-foreground font-medium">
					Architect v0.1
				</span>
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<SettingsDialog />
				</div>
			</div>
		</div>
	);
}
