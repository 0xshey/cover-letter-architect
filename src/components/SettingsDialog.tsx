"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const MODELS = [
	{ id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Exp)" },
	{ id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
	{ id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

export function SettingsDialog() {
	const { apiKey, setApiKey, selectedModel, setSelectedModel } =
		useAppStore();
	const [key, setKey] = useState(apiKey);
	const [model, setModel] = useState(selectedModel);
	const [open, setOpen] = useState(false);

	const handleSave = () => {
		setApiKey(key);
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
						Configure your AI provider settings. Leave API Key empty
						if using a local/free proxy (if configured).
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="model" className="text-right">
							Model
						</Label>
						<div className="col-span-3">
							<Select value={model} onValueChange={setModel}>
								<SelectTrigger id="model">
									<SelectValue placeholder="Select a model" />
								</SelectTrigger>
								<SelectContent>
									{MODELS.map((m) => (
										<SelectItem key={m.id} value={m.id}>
											{m.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="apiKey" className="text-right">
							API Key
						</Label>
						<Input
							id="apiKey"
							type="password"
							value={key}
							onChange={(e) => setKey(e.target.value)}
							placeholder="Gemini API Key"
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
