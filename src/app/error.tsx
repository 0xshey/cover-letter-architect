"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center space-y-8">
			<div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
				<AlertTriangle className="h-8 w-8 text-destructive" />
			</div>
			<div className="space-y-4 max-w-[450px]">
				<h1 className="text-2xl font-bold tracking-tight">
					Something went wrong!
				</h1>
				<p className="text-muted-foreground">
					We encountered an unexpected error.
				</p>
			</div>
			<div className="flex flex-col gap-4 w-full max-w-[300px]">
				<Button onClick={reset} size="lg" className="w-full">
					Try again
				</Button>
				<Button variant="ghost" asChild className="w-full">
					<Link href="/">Back to Home</Link>
				</Button>
			</div>
		</div>
	);
}
