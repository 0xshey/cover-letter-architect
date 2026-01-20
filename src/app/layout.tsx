import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google"; // Import serif font
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({
	subsets: ["latin"],
	weight: ["300", "400", "700", "900"],
	variable: "--font-serif",
});

export const metadata: Metadata = {
	title: "Cover Letter Architect",
	description: "Assemble personalized cover letters with AI",
};

import { Providers } from "@/components/providers/Providers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppShell } from "@/components/layouts/AppShell";

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
					inter.variable,
					merriweather.variable
				)}
			>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<AppShell>{children}</AppShell>
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
