import { formatDistanceToNow } from "date-fns";
import { Trash2, Edit, Globe, Briefcase, Calendar } from "lucide-react";
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

export function ListItem({ letter, onOpen, onDelete }: LetterItemProps) {
	const companyName = letter.target_info?.companyName || "Untitled Company";
	const roleTitle = letter.target_info?.roleTitle || "Untitled Role";
	const updatedAt = letter.updated_at;

	return (
		<div
			className="group flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
			onClick={() => onOpen(letter)}
		>
			<div className="flex items-center gap-6 flex-1 min-w-0">
				{/* Company / Title */}
				<div className="flex flex-col min-w-[200px] gap-0.5">
					<div className="flex items-center gap-2 font-medium text-foreground group-hover:text-primary transition-colors truncate">
						<Globe className="h-3.5 w-3.5 text-muted-foreground/70" />
						{companyName}
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
						<Briefcase className="h-3.5 w-3.5 text-muted-foreground/50" />
						{roleTitle}
					</div>
				</div>

				{/* Update Info (Hidden on mobile) */}
				<div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground/60 ml-auto mr-8">
					<Calendar className="h-3.5 w-3.5" />
					<span className="whitespace-nowrap">
						{formatDistanceToNow(new Date(updatedAt), {
							addSuffix: true,
						})}
					</span>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
				<Button
					variant="ghost"
					size="icon"
					onClick={(e) => {
						e.stopPropagation();
						onOpen(letter);
					}}
					className="h-8 w-8 text-muted-foreground hover:text-primary"
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
								permanently delete the cover letter for "
								{companyName}" and its history.
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
	);
}
