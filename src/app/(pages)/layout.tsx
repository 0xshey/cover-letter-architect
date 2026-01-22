import { Navigator } from "@/components/navigator";
import { AuthListener } from "@/components/auth/auth-listener";
import { FileText, LogOut } from "lucide-react"; // Add LogOut
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Add Button
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Add ThemeToggle

export default function PagesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col md:flex-row bg-background">
			{/* Client-side Auth Listener */}
			<AuthListener />

			{/* Desktop Sidebar (Left) */}
			<aside className="hidden md:flex w-fit flex-col fixed left-0 top-0 h-full z-40 bg-background transition-all duration-300 border-r">
				{/* Top: Logo */}
				<div className="p-4 shrink-0 mt-4">
					<Link
						href="/dashboard"
						className="flex items-center justify-center hover:opacity-80 transition-opacity"
					>
						<span className="text-2xl font-bold font-mono tracking-tighter">
							CLA
						</span>
					</Link>
				</div>

				{/* Center: Navigation */}
				<div className="flex-1 flex flex-col justify-center w-full">
					<Navigator mode="desktop" />
				</div>

				{/* Bottom: Logout / Menu */}
				<div className="p-4 mb-4 shrink-0 mt-auto flex flex-col gap-4">
					<div className="flex justify-center">
						<ThemeToggle
							size={24}
							className="w-full h-auto py-3 justify-center text-muted-foreground hover:bg-muted group rounded-2xl"
						/>
					</div>
					<div className="relative">
						<form action="/auth/signout" method="post">
							<Button
								variant="ghost"
								className="w-full h-auto py-3 justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 group rounded-2xl"
								type="submit"
								title="Sign Out"
							>
								<LogOut className="h-6 w-6" />
							</Button>
						</form>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="w-full flex justify-center max-w-6xl mx-auto px-2 md:pr-0 md:pl-24 pb-16">
				{children}
			</main>

			{/* Mobile Bottom Bar */}
			<Navigator mode="mobile" />
		</div>
	);
}
