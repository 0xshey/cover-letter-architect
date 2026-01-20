"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPane } from "@/components/editor/editor-pane";
import { Button } from "@/components/ui/button";
import {
	Wand2,
	Download,
	Loader2,
	ChevronLeft,
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

interface WorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {}

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
		session,
		currentCoverLetterId,
		setCurrentCoverLetterId,
	} = useAppStore();
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
		<div className={cn("flex flex-col h-full", className)} {...props}>
			<ErrorDialog
				open={!!error}
				onOpenChange={(open) => !open && setError(null)}
				error={error}
				title="Action Failed"
			/>
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
							<TabsList className="bg-transparent p-0 gap-1">
								<TabsTrigger
									value="editor"
									className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none px-4 rounded-none border-b-2 border-transparent text-xs font-sans"
								>
									Editor
								</TabsTrigger>
								<TabsTrigger
									value="latex"
									className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none px-4 rounded-none border-b-2 border-transparent text-xs font-sans"
								>
									LaTeX
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
					{session && (
						<Button
							variant={isSaved ? "default" : "outline"}
							size="sm"
							onClick={handleSave}
							disabled={!session || isSaved}
							title="Save to Cloud"
							className={cn(
								"h-8 md:h-8 transition-all duration-300",
								isSaved &&
									"bg-success hover:bg-success text-white border-success"
							)}
						>
							{isSaved ? (
								<>
									<Check className="h-4 w-4 md:mr-2" />
									<span className="hidden md:inline text-xs font-sans">
										Saved
									</span>
								</>
							) : (
								<>
									<Save className="h-4 w-4 md:mr-2" />
									<span className="hidden md:inline text-xs font-sans">
										Save
									</span>
								</>
							)}
						</Button>
					)}
					{session && currentLetter && (
						<>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 md:h-8 md:w-auto md:px-2.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-destructive/10 hover:text-destructive"
								onClick={() => setCurrentLetter(null)}
								title="Clear Content"
							>
								<Trash2 className="h-3.5 w-3.5 md:mr-1.5" />
								<span className="hidden md:inline text-xs font-sans">
									Clear
								</span>
							</Button>

							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 md:h-8 md:w-auto md:px-2.5 text-muted-foreground hover:text-foreground rounded-md"
								disabled={!currentLetter}
								onClick={async () => {
									if (!currentLetter) return;

									const date = new Date()
										.toISOString()
										.split("T")[0];
									const company =
										targetInfo.companyName.replace(
											/[^a-z0-9]/gi,
											"_"
										);
									const role = targetInfo.roleTitle.replace(
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

										if (!response.ok) {
											const errData =
												await response.json();
											throw new Error(
												errData.details ||
													"Failed to generate PDF"
											);
										}

										const blob = await response.blob();
										const url = URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = filename;
										document.body.appendChild(a);
										a.click();
										document.body.removeChild(a);
										URL.revokeObjectURL(url);
									} catch (err) {
										console.error(
											"Download PDF failed:",
											err
										);
										alert(
											"Failed to download PDF. Please try again."
										);
									}
								}}
								title="Download PDF"
							>
								<Download className="h-3.5 w-3.5 md:mr-1.5" />
								<span className="hidden md:inline text-xs font-sans">
									Download PDF
								</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 md:h-8 md:w-auto md:px-2.5 text-muted-foreground hover:text-foreground rounded-md"
								disabled={!currentLetter}
								onClick={() => {
									if (!currentLetter) return;

									const date = new Date()
										.toISOString()
										.split("T")[0];
									const company =
										targetInfo.companyName.replace(
											/[^a-z0-9]/gi,
											"_"
										);
									const role = targetInfo.roleTitle.replace(
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
								title="Download Source (.tex)"
							>
								<Code className="h-3.5 w-3.5 md:mr-1.5" />
								<span className="hidden md:inline text-xs font-sans">
									Source (.tex)
								</span>
							</Button>
						</>
					)}

					<TooltipProvider>
						<Tooltip delayDuration={300}>
							<TooltipTrigger asChild>
								{/* Span wrapper required to allow tooltip events on disabled button */}
								<span
									className={
										!session ? "cursor-not-allowed" : ""
									}
								>
									<Button
										variant="secondary"
										size="sm"
										onClick={handleGenerate}
										disabled={isGenerating || !session}
										className="h-8 w-8 p-0 md:h-8 md:w-auto md:px-2.5 shadow-none rounded-md"
										title={
											session
												? currentLetter
													? "Regenerate Cover Letter"
													: "Generate Cover Letter"
												: undefined
										}
									>
										{isGenerating ? (
											<>
												<Loader2 className="h-3 w-3 animate-spin md:mr-1.5" />
												<span className="hidden md:inline text-xs font-sans leading-none">
													{currentLetter
														? "Regenerating..."
														: "Generating..."}
												</span>
											</>
										) : (
											<>
												<Wand2 className="h-3 w-3 md:mr-1.5" />
												<span className="hidden md:inline text-xs font-sans leading-none">
													{currentLetter
														? "Regenerate"
														: "Generate"}
												</span>
											</>
										)}
									</Button>
								</span>
							</TooltipTrigger>
							{!session && (
								<TooltipContent>
									<p>Sign in to access generation models</p>
								</TooltipContent>
							)}
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			<div className="flex-1 overflow-hidden bg-muted/10 relative">
				<Tabs value={activeTab} className="h-full p-2 pb-4 pr-4 w-full">
					<TabsContent
						value="editor"
						className="h-full mt-0 data-[state=active]:flex flex-col border rounded overflow-hidden"
					>
						<EditorPane />
					</TabsContent>
					<TabsContent
						value="latex"
						className="h-full mt-0 data-[state=active]:flex flex-col border rounded overflow-hidden bg-background"
					>
						<div className="p-8 h-full overflow-auto font-mono text-xs whitespace-pre-wrap">
							{currentLetter
								? generateLatexCode(targetInfo, currentLetter)
								: "Generate a letter to see the LaTeX source."}
						</div>
					</TabsContent>
					<TabsContent
						value="preview"
						className="h-full mt-0 data-[state=active]:block rounded overflow-hidden border bg-muted"
					>
						<PreviewPane />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
