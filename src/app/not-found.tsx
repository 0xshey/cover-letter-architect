import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center space-y-8">
			<div className="space-y-4">
				<h1 className="text-9xl font-extrabold tracking-tighter text-muted-foreground/20">
					404
				</h1>
				<h2 className="text-2xl font-bold tracking-tight">
					Page not found
				</h2>
				<p className="text-muted-foreground max-w-[500px] mx-auto">
					Sorry, we couldn&apos;t find the page you&apos;re looking
					for. It might have been moved or deleted.
				</p>
			</div>
			<div className="flex gap-4">
				<Button asChild>
					<Link href="/">
						<MoveLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Link>
				</Button>
			</div>
		</div>
	);
}
