"use client";

import { useState, useEffect } from "react";
import { Settings, RefreshCw } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signIn, signOut, useSession } from "next-auth/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Fallback models if API fails or user not signed in
const DEFAULT_MODELS = [
	{ id: "gemini-3.0-flash", name: "Gemini 3.0 Flash" }, // Newest
	{ id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Exp)" },
	{ id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
	{ id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

export function SettingsDialog() {
	const { data: session } = useSession();
	const { selectedModel, setSelectedModel } = useAppStore();
	const [model, setModel] = useState(selectedModel);
	const [open, setOpen] = useState(false);
	const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS);
	const [isLoadingModels, setIsLoadingModels] = useState(false);

	useEffect(() => {
		if (open && session) {
			fetchModels();
		}
	}, [open, session]);

	const fetchModels = async () => {
		setIsLoadingModels(true);
		try {
			const res = await fetch("/api/models");
			if (res.ok) {
				const data = await res.json();
				if (data.models && data.models.length > 0) {
					// Prioritize 3.0 and 2.0 models by sorting or just trust API?
					// API returns many. Let's just use them.
					// We might want to prioritize specific ones?
					// Let's just use what API gives, but maybe unshift our favorites if missing?
					setAvailableModels(data.models);
				}
			}
		} catch (error) {
			console.error("Failed to fetch models", error);
		} finally {
			setIsLoadingModels(false);
		}
	};

	const handleSave = () => {
		setSelectedModel(model);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" title="Settings">
					<Settings className="h-4 w-4" />
					<span className="sr-only">Settings</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Configure your AI model. Authenticate with Google to
						fetch available Gemini models.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="model" className="text-right">
							Model
						</Label>
						<div className="col-span-3 flex items-center gap-2">
							<Select value={model} onValueChange={setModel}>
								<SelectTrigger id="model" className="flex-1">
									<SelectValue placeholder="Select a model" />
								</SelectTrigger>
								<SelectContent>
									{availableModels.map((m) => (
										<SelectItem key={m.id} value={m.id}>
											{m.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{session && (
								<Button
									variant="ghost"
									size="icon"
									onClick={fetchModels}
									disabled={isLoadingModels}
									title="Refresh Models"
								>
									<RefreshCw
										className={`h-4 w-4 ${
											isLoadingModels
												? "animate-spin"
												: ""
										}`}
									/>
								</Button>
							)}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label className="text-right">Account</Label>
						<div className="col-span-3 flex flex-col gap-2">
							{session ? (
								<div className="flex items-center justify-between border p-2 rounded text-sm">
									<span className="truncate max-w-[150px]">
										{session.user?.email}
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => signOut()}
									>
										Sign Out
									</Button>
								</div>
							) : (
								<Button
									variant="default"
									onClick={() => signIn("google")}
									className="w-full"
								>
									Sign In with Google
								</Button>
							)}
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
