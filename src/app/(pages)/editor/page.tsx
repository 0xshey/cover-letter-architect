import { PersonalDetailsEditor } from "@/components/editor/personal-details-editor";
import { RoleDetailsEditor } from "@/components/editor/role-details-editor";
import { BlockEditor } from "@/components/editor/block-editor";
import { Canvas } from "@/components/editor/canvas";

export default function EditorPage() {
	return (
		<main className="h-screen w-full overflow-hidden flex flex-col">
			<div className="flex-1 overflow-y-scroll p-4 flex flex-col gap-4 max-w-6xl mx-auto w-full mt-40">
				<h1 className="text-4xl mb-2 font-bold tracking-tight text-foreground">
					Cover Letter Editor
				</h1>
				{/* Top Row: Details Editors */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto min-h-80 shrink-0">
					<PersonalDetailsEditor className="bg-muted/50" />
					<RoleDetailsEditor className="bg-muted/50" />
					<BlockEditor className="bg-muted/50" />
				</div>

				{/* Bottom Row: Block Editor + Canvas */}
				<div className="flex-1 min-h-0 gap-4">
					<Canvas className="h-full shadow-sm" />
				</div>
			</div>
		</main>
	);
}
