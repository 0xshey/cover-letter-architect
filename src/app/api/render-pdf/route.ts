import { NextRequest, NextResponse } from "next/server";
import latex from "node-latex";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
	try {
		const { latexCode } = await req.json();

		if (!latexCode) {
			return NextResponse.json(
				{ error: "No LaTeX code provided" },
				{ status: 400 }
			);
		}

		// Create a readable stream from the string
		const input = Readable.from([latexCode]);

		// Generate PDF
		// node-latex returns a stream
		// Generate PDF
		// node-latex returns a stream
		const pdf = latex(input);

		// Buffer the stream
		const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
			const chunks: Uint8Array[] = [];
			pdf.on("data", (chunk: Uint8Array) => chunks.push(chunk));
			pdf.on("error", (err: Error) => reject(err));
			pdf.on("end", () => resolve(Buffer.concat(chunks)));
		});

		return new NextResponse(pdfBuffer, {
			headers: {
				"Content-Type": "application/pdf",
				// "Content-Disposition": "inline; filename=preview.pdf"
			},
		});
	} catch (error: any) {
		console.error("LaTeX generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate PDF", details: error.message },
			{ status: 500 }
		);
	}
}
