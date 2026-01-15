"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPane } from "@/components/editor/EditorPane";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { Button } from "@/components/ui/button";
import { Wand2, Download, Loader2, ChevronLeft } from "lucide-react";

interface WorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Workspace({ className, ...props }: WorkspaceProps) {
	const {
		isGenerating,
		currentLetter,
		blocks,
		targetInfo,
		apiKey,
		selectedModel,
		setIsGenerating,
		setCurrentLetter,
		saveLetter,
		setActiveMobileView,
	} = useAppStore();
	const [activeTab, setActiveTab] = useState("editor");
	const { toast } = { toast: (opts: any) => console.log(opts) };

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
		} catch (error: any) {
			console.error(error);
			alert(error.message);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className={cn("flex flex-col h-full", className)} {...props}>
			<div className="flex items-center px-4 py-2 justify-between bg-background z-10 shrink-0 h-14">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden rounded-full bg-yellow-400 text-black -ml-2"
						onClick={() => setActiveMobileView("sidebar")}
						title="Go to Blocks"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="flex items-center gap-4">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="h-9"
						>
							<TabsList>
								<TabsTrigger value="editor">Editor</TabsTrigger>
								<TabsTrigger value="preview">
									Preview
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-9 p-0 md:h-9 md:w-auto md:px-3"
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
						<Download className="h-4 w-4 md:mr-2" />
						<span className="hidden md:inline">Download</span>
					</Button>
					<Button
						size="sm"
						onClick={handleGenerate}
						disabled={isGenerating}
						className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 w-9 p-0 md:h-9 md:w-auto md:px-3"
						title="Generate Cover Letter"
					>
						{isGenerating ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin md:mr-2" />
								<span className="hidden md:inline">
									Generating...
								</span>
							</>
						) : (
							<>
								<Wand2 className="h-4 w-4 md:mr-2" />
								<span className="hidden md:inline">
									Generate
								</span>
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
