"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPane } from "@/components/editor/EditorPane";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { Button } from "@/components/ui/button";
import { Wand2, Download, Loader2 } from "lucide-react";

interface WorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Workspace({ className, ...props }: WorkspaceProps) {
	const {
		isGenerating,
		currentLetter,
		blocks,
		targetInfo,
		apiKey,
		selectedModel, // Add this
		setIsGenerating,
		setCurrentLetter,
		saveLetter,
	} = useAppStore();
	const [activeTab, setActiveTab] = useState("editor");
	const { toast } = { toast: (opts: any) => console.log(opts) }; // Placeholder for toast if we want it later

	const handleGenerate = async () => {
		if (blocks.filter((b) => b.isEnabled).length === 0) {
			alert("Please enable at least one content block.");
			return;
		}

		setIsGenerating(true);
		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					blocks: blocks.filter((b) => b.isEnabled),
					targetInfo,
					apiKey,
					model: selectedModel, // Pass the selected model
				}),
			});

			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.error || "Failed to generate");
			}

			const data = await response.json();
			setCurrentLetter(data.markdown);

			// Auto-save history
			saveLetter({
				id: crypto.randomUUID(),
				markdown: data.markdown,
				rawText: data.rawText || data.markdown,
				createdAt: new Date().toISOString(),
				targetCompany: targetInfo.companyName,
				targetRole: targetInfo.roleTitle,
			});

			setActiveTab("preview"); // Switch to preview to see result
		} catch (error: any) {
			console.error(error);
			alert(error.message);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className={cn("flex flex-col h-full", className)} {...props}>
			<div className="flex items-center border-b border-border px-4 py-2 justify-between bg-background z-10 shrink-0 h-14">
				<div className="flex items-center gap-4">
					<h2 className="font-semibold text-sm">Workspace</h2>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="h-9"
					>
						<TabsList>
							<TabsTrigger value="editor">Editor</TabsTrigger>
							<TabsTrigger value="preview">Preview</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={!currentLetter}
						onClick={() => {
							if (!currentLetter) return;

							const date = new Date().toISOString().split("T")[0];
							const company = targetInfo.companyName.replace(
								/[^a-z0-9]/gi,
								"_"
							);
							const role = targetInfo.roleTitle.replace(
								/[^a-z0-9]/gi,
								"_"
							);
							const filename = `${date}_${company || "Company"}_${
								role || "Role"
							}.md`;

							const blob = new Blob([currentLetter], {
								type: "text/markdown",
							});
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = filename;
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
							URL.revokeObjectURL(url);
						}}
					>
						<Download className="mr-2 h-4 w-4" />
						Download
					</Button>
					<Button
						size="sm"
						onClick={handleGenerate}
						disabled={isGenerating}
						className="bg-indigo-600 hover:bg-indigo-700 text-white"
					>
						{isGenerating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating...
							</>
						) : (
							<>
								<Wand2 className="mr-2 h-4 w-4" />
								Generate
							</>
						)}
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-hidden bg-muted/10 relative">
				<Tabs value={activeTab} className="h-full w-full">
					<TabsContent
						value="editor"
						className="h-full mt-0 data-[state=active]:flex flex-col"
					>
						<EditorPane />
					</TabsContent>
					<TabsContent
						value="preview"
						className="h-full mt-0 data-[state=active]:block overflow-auto"
					>
						<PreviewPane />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
