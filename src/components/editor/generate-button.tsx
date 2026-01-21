"use client";

import { useGenerativeModel } from "@/hooks/use-generative-model";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
	onGenerate: () => void;
	className?: string;
}

export function GenerateButton({ onGenerate, className }: GenerateButtonProps) {
	const {
		session,
		selectedModel,
		setSelectedModel,
		availableModels,
		isLoadingModels,
		isGenerating,
	} = useGenerativeModel();

	const isGenerateDisabled =
		isGenerating || !session || isLoadingModels || !selectedModel;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{/* Model Selector */}
			<div className="flex items-center gap-2 px-2 py-0.5 bg-muted/50 rounded-lg border">
				<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
				<Select
					value={selectedModel}
					onValueChange={setSelectedModel}
					disabled={isLoadingModels || !session}
				>
					<SelectTrigger className="h-7 w-[160px] text-xs border-0 bg-transparent focus:ring-0 px-0 shadow-none">
						<SelectValue
							placeholder={
								isLoadingModels
									? "Fetching models..."
									: availableModels.length === 0
									? "No Models Available"
									: "Select Model"
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{availableModels.map((m) => (
							<SelectItem key={m.id} value={m.id}>
								{m.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Generate Button */}
			<TooltipProvider>
				<Tooltip delayDuration={300}>
					<TooltipTrigger asChild>
						<span
							className={
								isGenerateDisabled
									? "cursor-not-allowed opacity-50"
									: ""
							}
						>
							<Button
								variant="default"
								size="sm"
								onClick={onGenerate}
								disabled={isGenerateDisabled}
								className="h-8 px-3 shadow-none text-xs font-medium"
							>
								{isGenerating ? (
									<>
										<Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
										Generating...
									</>
								) : (
									<>
										<Wand2 className="h-3.5 w-3.5 mr-2" />
										Generate
									</>
								)}
							</Button>
						</span>
					</TooltipTrigger>
					{isGenerateDisabled && (
						<TooltipContent>
							<div className="text-xs flex flex-col gap-1">
								<p className="font-semibold">
									Generation Disabled:
								</p>
								{!session && <p>• Not signed in</p>}
								{isLoadingModels && <p>• Fetching models...</p>}
								{isGenerating && (
									<p>• Generation in progress...</p>
								)}
								{!selectedModel && <p>• No model selected</p>}
							</div>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
