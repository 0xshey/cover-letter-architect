"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsDialog } from "@/components/SettingsDialog";
import { BlockList } from "@/components/blocks/BlockList";
import { TargetInfoForm } from "@/components/blocks/TargetInfo";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

import { ModeToggle } from "@/components/ModeToggle";
import { useAppStore } from "@/store/useAppStore";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar({ className, ...props }: SidebarProps) {
	const { setActiveMobileView } = useAppStore();

	return (
		<div
			className={cn(
				"flex flex-col bg-muted/30 border-r border-border h-full",
				className
			)}
			{...props}
		>
			<div className="flex h-14 items-center border-b border-border px-4 justify-between shrink-0">
				<div className="flex items-center gap-2">
					<span className="font-bold tracking-tight">ARCHITECT</span>
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
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
				<div className="h-full flex flex-col gap-6">
					<TargetInfoForm />
					<div className="flex-1 min-h-0 relative">
						<ScrollArea className="h-full pr-4">
							<BlockList />
						</ScrollArea>
					</div>
				</div>
			</div>

			<div className="border-t border-border p-4 flex justify-between items-center bg-background/50">
				<span className="text-xs text-muted-foreground font-medium">
					Architect v0.1
				</span>
				<SettingsDialog />
			</div>
		</div>
	);
}
