"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockList } from "@/components/blocks/BlockList";
import { TargetInfoForm } from "@/components/blocks/TargetInfo";
import { useSession, signIn, signOut } from "next-auth/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAppStore } from "@/store/useAppStore";
import { ChevronRight, LogOut, User, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const DEFAULT_MODELS = [
	{ id: "gemini-3.0-flash", name: "Gemini 3.0 Flash" },
	{ id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Exp)" },
	{ id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
	{ id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

export function Sidebar({ className, ...props }: SidebarProps) {
	const { setActiveMobileView, selectedModel, setSelectedModel } =
		useAppStore();
	const { data: session } = useSession();
	const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS);
	const [isLoadingModels, setIsLoadingModels] = useState(false);

	useEffect(() => {
		if (session) {
			fetchModels();
		}
	}, [session]);

	const fetchModels = async () => {
		setIsLoadingModels(true);
		try {
			const res = await fetch("/api/models");
			if (res.ok) {
				const data = await res.json();
				if (data.models && data.models.length > 0) {
					setAvailableModels(data.models);
				}
			}
		} catch (error) {
			console.error("Failed to fetch models", error);
		} finally {
			setIsLoadingModels(false);
		}
	};

	return (
		<div className={cn("flex flex-col h-full", className)} {...props}>
			<div className="w-full flex h-14 items-center px-4 justify-between shrink-0">
				<div className="flex items-center gap-2">
					<span className="font-bold tracking-tight">
						COVER LETTER ARCHITECT™
					</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="scale-90">
						<ThemeToggle />
					</div>
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

			<div className="flex-1 overflow-hidden">
				<div className="h-full flex flex-col gap-8">
					<div className="flex-1 min-h-0 relativ p-4">
						<TargetInfoForm />
					</div>
					<div className=" min-h-0 relative pt-4 px-4">
						<BlockList />
					</div>
				</div>
			</div>

			{/* Footer: Auth & Models */}
			<div className="p-4 border-t bg-muted/30 flex flex-col gap-4 shrink-0">
				{/* Model Selector */}
				{session && (
					<div className="grid gap-2">
						<div className="flex items-center justify-between">
							<label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
								<Sparkles className="h-3 w-3" /> Model
							</label>
						</div>
						<div className="flex items-center gap-4">
							<Select
								value={selectedModel}
								onValueChange={setSelectedModel}
							>
								<SelectTrigger className="h-8 text-xs">
									<SelectValue placeholder="Select Model" />
								</SelectTrigger>
								<SelectContent>
									{availableModels.map((m) => (
										<SelectItem key={m.id} value={m.id}>
											{m.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Button
								variant="ghost"
								size="icon"
								className="h-4 w-4"
								onClick={fetchModels}
								disabled={isLoadingModels}
								title="Refresh Models"
							>
								<RefreshCw
									className={cn(
										"h-3 w-3",
										isLoadingModels && "animate-spin"
									)}
								/>
							</Button>
						</div>
					</div>
				)}

				{/* Account Section */}
				<div className="flex items-center justify-between gap-8 pt-2">
					{session ? (
						<div className="flex-1 flex items-center gap-4 border p-2 rounded-xl group bg-background/50 hover:bg-background transition-colors">
							<div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden ">
								{session.user?.image ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={session.user.image}
										alt="User"
										className="h-full w-full object-cover"
									/>
								) : (
									<User className="h-4 w-4 text-primary" />
								)}
							</div>
							<div className="flex-1 min-w-0 flex flex-col">
								<span className="text-xs font-medium truncate">
									{session.user?.name || "User"}
								</span>
								<span className="text-[10px] text-muted-foreground truncate">
									{session.user?.email}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
								onClick={() => signOut()}
								title="Sign Out"
							>
								<LogOut className="h-3.5 w-3.5" />
							</Button>
						</div>
					) : (
						<div className="flex-1 flex flex-col gap-2">
							<Button
								size="sm"
								onClick={() => signIn("google")}
								className="w-full text-xs"
							>
								Sign In with Google
							</Button>
							<div className="flex justify-center items-center px-1">
								<span className="text-[10px] text-muted-foreground">
									v0.1
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
