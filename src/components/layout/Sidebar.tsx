"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsDialog } from "@/components/SettingsDialog";
import { BlockList } from "@/components/blocks/BlockList";
import { TargetInfoForm } from "@/components/blocks/TargetInfo";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

import { ModeToggle } from "@/components/ModeToggle";

export function Sidebar({ className, ...props }: SidebarProps) {
	return (
		<div
			className={cn(
				"flex flex-col bg-muted/30 border-r border-border",
				className
			)}
			{...props}
		>
			<div className="flex h-14 items-center border-b border-border px-4 justify-between">
				<span className="font-bold tracking-tight">COVER LETTER</span>
				<ModeToggle />
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
