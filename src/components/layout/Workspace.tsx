"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPane } from "@/components/editor/EditorPane";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { Button } from "@/components/ui/button";
import { Wand2, Download, Loader2, ChevronLeft } from "lucide-react";

type WorkspaceProps = React.HTMLAttributes<HTMLDivElement>;

export function Workspace({ className, ...props }: WorkspaceProps) {
	const {
		isGenerating,
		currentLetter,
		blocks,
		targetInfo,
		selectedModel,
		setIsGenerating,
		setCurrentLetter,
		saveLetter,
		setActiveMobileView,
	} = useAppStore();
	const [activeTab, setActiveTab] = useState("editor");

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
					model: selectedModel,
				}),
			});

			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.error || "Failed to generate");
			}

			const data = await response.json();
			setCurrentLetter(data.markdown);

			saveLetter({
				id: crypto.randomUUID(),
				markdown: data.markdown,
				rawText: data.rawText || data.markdown,
				createdAt: new Date().toISOString(),
				targetCompany: targetInfo.companyName,
				targetRole: targetInfo.roleTitle,
			});

			setActiveTab("preview");
		} catch (error: unknown) {
			console.error(error);
			const message =
				error instanceof Error ? error.message : "An error occurred";
			alert(message);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className={cn("flex flex-col h-full", className)} {...props}>
			<div className="flex items-center px-4 py-2 justify-between shrink-0 h-14">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden h-8 w-8 rounded-md bg-yellow-400 text-black -ml-2"
						onClick={() => setActiveMobileView("sidebar")}
						title="Go to Blocks"
					>
						<ChevronLeft className="h-3.5 w-3.5" />
					</Button>
					<div className="flex items-center gap-4">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="h-9"
						>
							<TabsList className="bg-transparent p-0">
								<TabsTrigger
									value="editor"
									className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none px-4 rounded-none border-b-2 border-transparent text-xs font-sans"
								>
									Editor
								</TabsTrigger>
								<TabsTrigger
									value="preview"
									className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none px-4 rounded-none border-b-2 border-transparent text-xs font-sans"
								>
									Preview
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 md:h-8 md:w-auto md:px-2.5 text-muted-foreground hover:text-foreground rounded-md"
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
						title="Download Markdown"
					>
						<Download className="h-3.5 w-3.5 md:mr-1.5" />
						<span className="hidden md:inline text-xs font-sans">
							Download
						</span>
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={handleGenerate}
						disabled={isGenerating}
						className="h-8 w-8 p-0 md:h-8 md:w-auto md:px-2.5 shadow-none rounded-md"
						title="Generate Cover Letter"
					>
						{isGenerating ? (
							<>
								<Loader2 className="h-3 w-3 animate-spin md:mr-1.5" />
								<span className="hidden md:inline text-xs font-sans leading-none">
									Generating...
								</span>
							</>
						) : (
							<>
								<Wand2 className="h-3 w-3 md:mr-1.5" />
								<span className="hidden md:inline text-xs font-sans leading-none">
									Generate
								</span>
							</>
						)}
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-hidden bg-muted/10 relative">
				<Tabs value={activeTab} className="h-full p-2 w-full">
					<TabsContent
						value="editor"
						className="h-full mt-0 data-[state=active]:flex flex-col border rounded overflow-hidden"
					>
						<EditorPane />
					</TabsContent>
					<TabsContent
						value="preview"
						className="h-full mt-0 data-[state=active]:block rounded overflow-hidden"
					>
						<PreviewPane />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
