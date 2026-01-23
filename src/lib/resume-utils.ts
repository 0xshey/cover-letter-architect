import { ResumeData } from "@/types/resume";

export function downloadResumeJson(data: ResumeData, filename = "resume.json") {
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function parseResumeJson(file: File): Promise<ResumeData> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target?.result as string);
				// Basic validation could happen here
				resolve(json);
			} catch (error) {
				reject(error);
			}
		};
		reader.onerror = (error) => reject(error);
		reader.readAsText(file);
	});
}
