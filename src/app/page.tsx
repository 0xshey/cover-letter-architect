import { Sidebar } from "@/components/layout/Sidebar";
import { Workspace } from "@/components/layout/Workspace";

export default function Home() {
	return (
		<main className="flex h-screen w-full flex-col md:flex-row overflow-hidden bg-background text-foreground">
			<Sidebar className="w-full md:w-[400px] border-r flex-shrink-0" />
			<Workspace className="flex-1 min-w-0" />
		</main>
	);
}
