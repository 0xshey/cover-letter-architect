import type { Metadata } from "next";
import { instrumentSerif, outfit } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Cover Letter Architect",
	description: "Assemble personalized cover letters with AI",
};

import { Providers } from "@/components/providers/root-providers"; // Renamed file import
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					instrumentSerif.variable,
					outfit.variable,
				)}
			>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
