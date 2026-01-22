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
			className="group cursor-pointer relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50"
			onClick={(e) => {
				e.stopPropagation();
				onOpen(letter);
			}}
		>
			<div className="p-4 space-y-4 relative z-10 w-full flex-1 flex flex-col">
				{/* Header Section */}
				<div className="space-y-1">
					<h3 className="font-semibold text-md leading-tight tracking-tight truncate pr-2 group-hover:text-primary transition-colors">
						{companyName || "Untitled Company"}
					</h3>
					<p className="text-sm font-medium text-muted-foreground truncate">
						{roleTitle || "Untitled Role"}
					</p>
				</div>

				{/* Content Snippet */}
				<div className="relative mt-auto flex-1 flex flex-col justify-end">
					<div className="relative z-20 text-sm text-muted-foreground/80 line-clamp-3 min-h-[4.5em] italic bg-muted/50 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-sm">
						{snippet}
					</div>
					{/* Blur overlay for the footer area below */}
					<div className="absolute -bottom-12 inset-x-0 h-16 bg-background/5 backdrop-blur-[2px] pointer-events-none z-10" />
				</div>
			</div>

			{/* Footer / Actions Section */}
			<div className="px-4 pb-4 relative z-10 mt-auto">
				<div className="flex items-center justify-between">
					<div
						className="flex items-center text-xs text-muted-foreground/60"
						title={new Date(updatedAt).toLocaleString()}
					>
						<Calendar className="h-4 w-4 mr-3" />
						{formatDistanceToNow(new Date(updatedAt), {
							addSuffix: true,
						})}
					</div>

					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => {
								e.stopPropagation();
								onOpen(letter);
							}}
							className="h-8 w-8 text-muted-foreground hover:text-primary"
							aria-label={`Edit ${companyName}`}
						>
							<Edit className="h-4 w-4" />
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-destructive"
									onClick={(e) => e.stopPropagation()}
									aria-label={`Delete ${companyName}`}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Delete Cover Letter?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										permanently delete the cover letter for
										"{companyName || "Untitled"}" and its
										history.
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
				</div>
			</div>
			<div
				className="absolute inset-0 z-0 cursor-pointer"
				onClick={() => onOpen(letter)}
				aria-hidden="true"
			/>
		</div>
	);
}
