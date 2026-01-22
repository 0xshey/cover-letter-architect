"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPane } from "@/components/editor/editor-pane";
import { Button } from "@/components/ui/button";
import {
	Wand2,
	Download,
	Loader2,
	Trash2,
	Code,
	Save,
	Check,
} from "lucide-react";
import { ErrorDialog } from "@/components/ui/error-dialog";
import { generateLatexCode } from "@/lib/latex-generator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { GenerateButton } from "@/components/editor/generate-button";
import { useGenerativeModel } from "@/hooks/use-generative-model";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";
import { useTargetStore } from "@/store/useTargetStore";
import { useEditorStore } from "@/store/useEditorStore";

interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {}

const PreviewPane = dynamic(
	() =>
		import("@/components/editor/preview-pane").then(
			(mod) => mod.PreviewPane
		),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		),
	}
);

export function Canvas({ className, ...props }: CanvasProps) {
	const { session } = useAuthStore();
	const { blocks } = useContentStore();
	const { targetInfo } = useTargetStore();
	const {
		currentLetter,
		setCurrentLetter,
		saveLetter,
		currentCoverLetterId,
		setCurrentCoverLetterId,
	} = useEditorStore();

	const { isGenerating, selectedModel, setIsGenerating, isLoadingModels } =
		useGenerativeModel();
	const [activeTab, setActiveTab] = useState("editor");
	const [error, setError] = useState<string | null>(null);
	const [isSaved, setIsSaved] = useState(false);

	const handleGenerate = async () => {
		if (blocks.filter((b) => b.isEnabled).length === 0) {
			setError("Please enable at least one content block.");
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
			setError(message);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSave = async () => {
		if (!session) return;

		const title = targetInfo.roleTitle
			? `${targetInfo.roleTitle} at ${targetInfo.companyName}`
			: targetInfo.companyName || "Untitled Cover Letter";

		const payload = {
			title,
			target_info: targetInfo,
			blocks,
			markdown: currentLetter,
			latex: currentLetter
				? generateLatexCode(targetInfo, currentLetter)
				: null,
		};

		try {
			const url = currentCoverLetterId
				? `/api/cover-letters/${currentCoverLetterId}`
				: "/api/cover-letters";

			const method = currentCoverLetterId ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				const data = await res.json();
				if (data.coverLetter) {
					setCurrentCoverLetterId(data.coverLetter.id);
					setIsSaved(true);
					setTimeout(() => setIsSaved(false), 5000);
				}
			} else {
				const err = await res.json();
				setError(err.error || "Failed to save");
			}
		} catch (error) {
			console.error("Save failed", error);
			setError("Failed to save changes.");
		}
	};

	return (
		<div
			className={cn(
				"flex flex-col h-full min-h-200 border rounded-xl overflow-hidden bg-muted/50",
				className
			)}
			{...props}
		>
			<ErrorDialog
				open={!!error}
				onOpenChange={(open) => !open && setError(null)}
				error={error}
				title="Action Failed"
			/>
			<div className="flex items-center px-4 justify-between shrink-0 h-12 border-b">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="h-full"
				>
					<TabsList className="h-full bg-transparent p-0 gap-4">
						<TabsTrigger
							value="editor"
							className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none px-2 rounded-none border-b-2 border-transparent text-xs font-medium"
						>
							Editor
						</TabsTrigger>
						<TabsTrigger
							value="latex"
							className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none px-2 rounded-none border-b-2 border-transparent text-xs font-medium"
						>
							LaTeX
						</TabsTrigger>
						<TabsTrigger
							value="preview"
							className="h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none px-2 rounded-none border-b-2 border-transparent text-xs font-medium"
						>
							Preview
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="flex items-center gap-4">
					<GenerateButton onGenerate={handleGenerate} />
					<div className="h-4 w-[1px] bg-border" />
					<div className="flex items-center gap-2">
						{session && (
							<Button
								variant={isSaved ? "outline" : "outline"}
								size="sm"
								onClick={handleSave}
								disabled={!session || isSaved}
								className={cn(
									"h-8 px-3 text-xs transition-colors",
									isSaved &&
										"text-green-600 border-green-200 bg-green-50"
								)}
							>
								{isSaved ? (
									<Check className="h-3.5 w-3.5 mr-2" />
								) : (
									<Save className="h-3.5 w-3.5 mr-2" />
								)}
								{isSaved ? "Saved" : "Save"}
							</Button>
						)}

						{session && currentLetter && (
							<div className="flex items-center gap-1 border-l pl-2 ml-2">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-destructive"
									onClick={() => setCurrentLetter(null)}
									title="Clear Content"
								>
									<Trash2 className="h-4 w-4" />
								</Button>

								{/* Download buttons logic kept but simplified icon-only for space if needed, or keeping dropdown? Kept separate for now. */}
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-foreground"
									onClick={async () => {
										if (!currentLetter) return;
										// ... (PDF logic existing)
										// RE-USING PREVIOUS LOGIC FOR PDF
										const date = new Date()
											.toISOString()
											.split("T")[0];
										const company =
											targetInfo.companyName.replace(
												/[^a-z0-9]/gi,
												"_"
											);
										const role =
											targetInfo.roleTitle.replace(
												/[^a-z0-9]/gi,
												"_"
											);
										const filename = `${date}_${
											company || "Company"
										}_${role || "Role"}.pdf`;

										try {
											const latexCode = generateLatexCode(
												targetInfo,
												currentLetter
											);
											const response = await fetch(
												"/api/render-pdf",
												{
													method: "POST",
													headers: {
														"Content-Type":
															"application/json",
													},
													body: JSON.stringify({
														latexCode,
													}),
												}
											);
											if (!response.ok)
												throw new Error("Failed");
											const blob = await response.blob();
											const url =
												URL.createObjectURL(blob);
											const a =
												document.createElement("a");
											a.href = url;
											a.download = filename;
											document.body.appendChild(a);
											a.click();
											document.body.removeChild(a);
											URL.revokeObjectURL(url);
										} catch (err) {
											alert("Failed to download PDF");
										}
									}}
									title="Download PDF"
								>
									<Download className="h-4 w-4" />
								</Button>

								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-foreground"
									onClick={() => {
										// ... (.tex logic)
										if (!currentLetter) return;
										// RE-USING LOGIC
										const date = new Date()
											.toISOString()
											.split("T")[0];
										const company =
											targetInfo.companyName.replace(
												/[^a-z0-9]/gi,
												"_"
											);
										const role =
											targetInfo.roleTitle.replace(
												/[^a-z0-9]/gi,
												"_"
											);
										const filename = `${date}_${
											company || "Company"
										}_${role || "Role"}.tex`;
										const latexCode = generateLatexCode(
											targetInfo,
											currentLetter
										);
										const blob = new Blob([latexCode], {
											type: "application/x-latex",
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
									title="Download .tex"
								>
									<Code className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-hidden relative">
				<Tabs value={activeTab} className="h-full w-full">
					<TabsContent
						value="editor"
						className="h-full mt-0 data-[state=active]:flex flex-col overflow-hidden"
					>
						<EditorPane />
					</TabsContent>
					<TabsContent
						value="latex"
						className="h-full mt-0 data-[state=active]:flex flex-col overflow-hidden bg-background"
					>
						<div className="p-8 h-full overflow-auto font-mono text-xs whitespace-pre-wrap">
							{currentLetter
								? generateLatexCode(targetInfo, currentLetter)
								: "Generate a letter to see the LaTeX source."}
						</div>
					</TabsContent>
					<TabsContent
						value="preview"
						className="h-full mt-0 data-[state=active]:block overflow-hidden bg-muted"
					>
						<PreviewPane />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
