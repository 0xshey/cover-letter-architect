import { Navigator } from "@/components/navigator";
import { UserFooter } from "@/components/layouts/user-footer";
import { AuthListener } from "@/components/auth/auth-listener";
import { FileText } from "lucide-react";
import Link from "next/link";

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
			<aside className="hidden md:flex w-fit flex-col fixed left-0 top-0 h-full z-40 bg-background transition-all duration-300">
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
				<UserFooter />
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 max-w-6xl mx-auto pb-16 md:pb-0 min-w-0 border border-red-500">
				{children}
			</main>

			{/* Mobile Bottom Bar */}
			<Navigator mode="mobile" />
		</div>
	);
}
