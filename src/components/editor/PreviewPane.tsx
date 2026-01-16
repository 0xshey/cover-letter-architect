"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { generateLatexCode } from "@/lib/latex-generator";

export function PreviewPane() {
	const { currentLetter, targetInfo } = useAppStore();
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPdf = async () => {
			if (!currentLetter) {
				if (pdfUrl) URL.revokeObjectURL(pdfUrl);
				setPdfUrl(null);
				return;
			}

			setIsLoading(true);
			setError(null);
			// Ideally we revoke old URL to avoid leaks, but we need to keep it until new one loads
			// or show loading state.
			// Let's hold onto old one briefly or clear it? Clearing it shows flicker.
			// Just clearing old one is safer.
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
			setPdfUrl(null);

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

		// Debounce slightly? For now standard effect is fine as currentLetter changes only on generation
		fetchPdf();

		return () => {
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLetter, targetInfo]);

	return (
		<div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 overflow-hidden p-8">
			{!currentLetter ? (
				<div className="text-muted-foreground italic">
					Preview will appear here...
				</div>
			) : isLoading && !pdfUrl ? (
				<div className="flex flex-col items-center gap-2 text-muted-foreground">
					<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<span>Rendering PDF...</span>
				</div>
			) : error ? (
				<div className="text-destructive p-4 bg-destructive/50 rounded max-w-md text-center">
					<p className="font-semibold mb-1">Preview Error</p>
					<p className="text-sm overflow-auto max-h-40 whitespace-pre-wrap text-left text-xs bg-white/50 p-2 rounded mt-2">
						{error}
					</p>
				</div>
			) : (
				<iframe
					src={pdfUrl + "#toolbar=0&navpanes=0&view=Fit"}
					className="w-full h-full border-none shadow-lg bg-white rounded-sm"
					title="PDF Preview"
				/>
			)}
		</div>
	);
}
