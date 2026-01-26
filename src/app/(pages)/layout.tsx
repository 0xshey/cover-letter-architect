import { SidebarNavigator } from "@/components/navigators/sidebar-navigator";
import { MobileNavigator } from "@/components/navigators/mobile-navigator";
import { AuthListener } from "@/components/auth/auth-listener";
import Link from "next/link";
import { UserMenu } from "@/components/user-menu";

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
			<aside className="hidden md:flex w-fit flex-col items-center fixed left-0 top-0 h-full z-40 transition-all duration-300 no-scrollbar overflow-y-auto ml-2">
				{/* Top: Logo */}
				<div className="w-fit p-2 shrink-0 mt-4">
					<Link
						href="/letters"
						className="flex items-center justify-center hover:opacity-80 transition-opacity"
					>
						<span className="text-xl font-bold font-mono tracking-tighter">
							CLA
						</span>
					</Link>
				</div>

				{/* Center: Navigation */}
				<div className="flex-1 flex flex-col justify-center w-full">
					<SidebarNavigator />
				</div>

				{/* Bottom: Logout / Menu */}
				<div className="w-fit p-2 mb-4 shrink-0 mt-auto w-full">
					<UserMenu />
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="w-full flex justify-center max-w-6xl mx-auto px-2 md:pl-24 pb-16">
				{children}
			</main>

			{/* Mobile Bottom Bar */}
			<MobileNavigator />
		</div>
	);
}
