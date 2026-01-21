"use client";

import { useEffect, useState, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { useTargetStore } from "@/store/useTargetStore";
import { generateLatexCode } from "@/lib/latex-generator";
import { Document, Page, pdfjs } from "react-pdf";

// Required for react-pdf to work
// Using unpkg to load the worker matching the installed version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PreviewPane() {
	const { currentLetter } = useEditorStore();
	const { targetInfo } = useTargetStore();
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>(0);
	const containerRef = useRef<HTMLDivElement>(null);

	// Create Blob URL for PDF
	useEffect(() => {
		const fetchPdf = async () => {
			if (!currentLetter) {
				if (pdfUrl) URL.revokeObjectURL(pdfUrl);
				setPdfUrl(null);
				return;
			}

			setIsLoading(true);
			setError(null);
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
			// setPdfUrl(null); // Optional: clear to show loading

			try {
				const latexCode = generateLatexCode(targetInfo, currentLetter);
				const response = await fetch("/api/render-pdf", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ latexCode }),
				});

				if (!response.ok) {
					const errData = await response.json();
					throw new Error(
						errData.details ||
							errData.error ||
							"Failed to render PDF"
					);
				}

				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				setPdfUrl(url);
			} catch (err: any) {
				console.error("PDF Preview Error:", err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPdf();

		return () => {
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLetter, targetInfo]);

	// Handle resize to fit PDF to container
	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) {
				const width = containerRef.current.clientWidth;
				// Subtract padding (p-8 = 2rem * 2 = 64px)
				const maxWidth = 900;
				setContainerWidth(Math.min(width - 64, maxWidth));
			}
		};

		updateWidth();
		window.addEventListener("resize", updateWidth);

		const observer = new ResizeObserver(updateWidth);
		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			window.removeEventListener("resize", updateWidth);
			observer.disconnect();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="h-full w-full flex justify-center bg-transparent overflow-y-auto p-8"
		>
			{!currentLetter ? (
				<div className="text-muted-foreground italic mt-20">
					Preview will appear here...
				</div>
			) : error ? (
				<div className="text-destructive p-4 bg-destructive/10 rounded max-w-md text-center mt-20 h-fit">
					<p className="font-semibold mb-1">Preview Error</p>
					<p className="text-sm overflow-auto max-h-40 whitespace-pre-wrap text-left text-xs bg-white/50 p-2 rounded mt-2">
						{error}
					</p>
				</div>
			) : (
				<div className="relative h-fit">
					{isLoading && !pdfUrl && (
						<div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm">
							<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
						</div>
					)}

					{pdfUrl && (
						<Document
							file={pdfUrl}
							loading={
								<div className="flex items-center gap-2 text-muted-foreground justify-center p-10">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
									Loading...
								</div>
							}
							error={
								<div className="text-destructive p-4">
									Failed to load PDF file.
								</div>
							}
							className="flex flex-col gap-4"
						>
							<Page
								pageNumber={1}
								width={containerWidth || 600}
								className="shadow-lg bg-white"
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						</Document>
					)}
				</div>
			)}
		</div>
	);
}
