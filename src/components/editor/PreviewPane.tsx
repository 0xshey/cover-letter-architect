"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { renderAsync } from "docx-preview";
import { createCoverLetterDoc } from "@/lib/docx-generator";

export function PreviewPane() {
	const { currentLetter, targetInfo } = useAppStore();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const renderDoc = async () => {
			if (currentLetter && containerRef.current) {
				setIsLoading(true);
				try {
					const blob = await createCoverLetterDoc(
						targetInfo,
						currentLetter
					);
					// Clear previous content
					containerRef.current.innerHTML = "";
					// Create a dedicated wrapper because docx-preview appends styles globally sometimes or needs wrapping
					await renderAsync(blob, containerRef.current, undefined, {
						className: "docx_viewer", // optional class
						inWrapper: true,
						ignoreWidth: false,
						ignoreHeight: false,
						// docx-preview options
					});
				} catch (err) {
					console.error("Failed to render docx preview:", err);
				} finally {
					setIsLoading(false);
				}
			}
		};

		renderDoc();
	}, [currentLetter, targetInfo]);

	return (
		<div className="h-full overflow-auto bg-muted/50 p-4 md:p-8 border rounded flex flex-col items-center">
			{!currentLetter ? (
				<div className="h-full flex items-center justify-center text-muted-foreground italic">
					Preview will appear here...
				</div>
			) : (
				<div
					ref={containerRef}
					// docx-preview renders styled HTML. We ensure it's centered and has a paper-like shadow.
					className="bg-white shadow-xl min-h-[297mm] w-full max-w-[210mm] p-0 overflow-hidden text-black transition-opacity duration-300"
					style={{ opacity: isLoading ? 0.5 : 1 }}
				/>
			)}
		</div>
	);
}
