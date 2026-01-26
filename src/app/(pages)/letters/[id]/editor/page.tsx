"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RoleDetailsEditor } from "@/components/editor/role-details-editor";
import { BlockEditor } from "@/components/editor/block-editor";
import { Canvas } from "@/components/editor/canvas";
import { SaveButton } from "@/components/editor/save-button";
import { useEditorStore } from "@/store/useEditorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useTargetStore } from "@/store/useTargetStore";
import { useContentStore } from "@/store/useContentStore";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EditorPage() {
	const params = useParams();
	const id = params.id as string;

	const { setCurrentLetter, setCurrentCoverLetterId } = useEditorStore();
	const { setTargetInfo } = useTargetStore();
	const { setBlocks } = useContentStore();
	const { session } = useAuthStore();
	const supabase = createClient();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadLetter() {
			if (!id || !session) return;

			try {
				const { data, error } = await supabase
					.from("cover_letters")
					.select("*")
					.eq("id", id)
					.single();

				if (error) throw error;

				if (data) {
					setCurrentCoverLetterId(data.id);
					setCurrentLetter(data.markdown);
					if (data.target_info) setTargetInfo(data.target_info);
					if (data.blocks) setBlocks(data.blocks);
				}
			} catch (error) {
				console.error("Failed to load letter:", error);
				toast.error("Failed to load cover letter");
			} finally {
				setIsLoading(false);
			}
		}

		loadLetter();
	}, [
		id,
		session,
		supabase,
		setCurrentCoverLetterId,
		setCurrentLetter,
		setTargetInfo,
		setBlocks,
	]);

	if (isLoading) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<main className="h-screen w-full overflow-hidden flex flex-col">
			<div className="flex-1 overflow-y-scroll p-4 flex flex-col gap-4 max-w-6xl mx-auto w-full mt-40">
				<div className="flex flex-col gap-2 mb-2">
					<Link
						href="/letters"
						className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm w-fit transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Dashboard
					</Link>
					<div className="flex items-center justify-between">
						<h1 className="text-4xl font-bold tracking-tight text-foreground">
							Cover Letter Editor
						</h1>
						<SaveButton />
					</div>
				</div>

				{/* Top Row: Details Editors */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto min-h-100 max-h-180 shrink-0">
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
