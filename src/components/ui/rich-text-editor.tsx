"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	content: string | object;
	onChange: (html: string) => void;
	className?: string;
}

const RichTextEditor = ({
	content,
	onChange,
	className,
}: RichTextEditorProps) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
		],
		content: content,
		editorProps: {
			attributes: {
				class: cn(
					"max-w-none focus:outline-none",
					"min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					// Custom list styling to ensure bullets are visible
					"[&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-4",
					"[&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-4",
					"[&_li]:marker:text-foreground [&_li]:pl-1", // Add a bit of padding to text
					// Basic typography for paragraphs and headings
					"[&_p]:leading-relaxed [&_p]:my-2",
					"[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4",
					"[&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3",
					"[&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2",
					"[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4",
					className,
				),
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		immediatelyRender: false,
	});

	// Handle external content updates (optional, be careful with loops)
	// If the parent component updates `content` prop significantly, we might want to update the editor.
	// For simple forms, this is usually strictly controlled or strictly uncontrolled.
	// We'll stick to initial render for now unless desired, but user said "Initial HTML", implying uncontrolled.

	if (!editor) {
		return null;
	}

	return (
		<div className="w-full">
			<EditorContent editor={editor} />
		</div>
	);
};

export default RichTextEditor;
