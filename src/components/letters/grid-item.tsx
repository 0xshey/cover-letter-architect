import { formatDistanceToNow } from "date-fns";
import { Trash2, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LetterItemProps } from "./types";

export function GridItem({ letter, onOpen, onDelete }: LetterItemProps) {
	const companyName = letter.target_info?.companyName;
	const roleTitle = letter.target_info?.roleTitle;
	const updatedAt = letter.updated_at;

	const getPreviewText = () => {
		if (letter.markdown) return letter.markdown;
		if (Array.isArray(letter.blocks)) {
			const textBlocks = letter.blocks
				.filter((b: any) => b.content && typeof b.content === "string")
				.map((b: any) => b.content)
				.join(" ");
			if (textBlocks) return textBlocks;
		}
		return "No preview content available.";
	};

	const snippet = getPreviewText();

	return (
		<div
			className="group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl aspect-[21/29.7]"
			onClick={(e) => {
				e.stopPropagation();
				onOpen(letter);
			}}
		>
			<div className="relative z-10 w-full h-full flex flex-col">
				{/* Header Section */}
				<div className="space-y-1.5 mb-4 p-6">
					<h3 className="font-bold text-3xl leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors font-serif">
						{companyName || "Untitled Company"}
					</h3>
					<p className="text-sm font-medium text-muted-foreground line-clamp-1">
						{roleTitle || "Untitled Role"}
					</p>
					<div className="pt-2 text-xs text-muted-foreground/50 font-mono">
						{formatDistanceToNow(new Date(updatedAt), {
							addSuffix: true,
						})}
					</div>
				</div>

				{/* Content Snippet - "Popping up from bottom" */}
				<div className="mb-auto relative w-full pt-8 px-4 pb-0">
					<div
						className={cn(
							"bg-muted/30 backdrop-blur-sm border border-border/60 p-4 rounded-t-lg text-sm text-muted-foreground/80 overflow-hidden transition-transform duration-300 ease-out group-hover:-translate-y-3 shadow-sm",
							"typography-base [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-3 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-3 [&_p]:leading-relaxed [&_p]:my-2",
						)}
					>
						<div dangerouslySetInnerHTML={{ __html: snippet }} />
					</div>
				</div>

				{/* Bottom Gradient Shadown */}
				<div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background/80 via-background/40 to-transparent pointer-events-none z-20" />
			</div>

			{/* Hover Actions Overlay */}
			<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm z-30">
				<Button
					variant="ghost"
					size="icon"
					onClick={(e) => {
						e.stopPropagation();
						onOpen(letter);
					}}
					className="h-7 w-7 text-muted-foreground hover:text-primary"
					title="Edit"
				>
					<Edit className="h-3.5 w-3.5" />
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-muted-foreground hover:text-destructive"
							onClick={(e) => e.stopPropagation()}
							title="Delete"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Delete Cover Letter?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will
								permanently delete the cover letter for "
								{companyName || "Untitled"}" and its history.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={(e) => e.stopPropagation()}
							>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={(e) => {
									e.stopPropagation();
									onDelete(letter.id);
								}}
								className="bg-destructive hover:bg-destructive/90"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<div
				className="absolute inset-0 z-0 cursor-pointer"
				onClick={() => onOpen(letter)}
				aria-hidden="true"
			/>
		</div>
	);
}
