import { useEditorStore } from "@/store/useEditorStore";
import { Textarea } from "@/components/ui/textarea";

export function EditorPane() {
	const { currentLetter, setCurrentLetter } = useEditorStore();

	return (
		<div className="h-full flex flex-col relative w-full">
			<div className="flex-1 relative w-full h-full">
				<Textarea
					value={currentLetter || ""}
					onChange={(e) => setCurrentLetter(e.target.value)}
					className="h-full w-full resize-none p-4 font-sans text-xs leading-relaxed border-0 focus-visible:ring-0 rounded-none bg-transparent"
					placeholder="Content will appear here after generation..."
					spellCheck={false}
				/>
			</div>
		</div>
	);
}
