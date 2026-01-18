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

interface CoverLetterCardProps {
	companyName: string;
	roleTitle: string;
	snippet?: string;
	updatedAt: string;
	onOpen: () => void;
	onDelete: () => void;
	className?: string;
}

export function CoverLetterCard({
	companyName,
	roleTitle,
	snippet,
	updatedAt,
	onOpen,
	onDelete,
	className,
}: CoverLetterCardProps) {
	return (
		<div
			className={cn(
				"group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50",
				className
			)}
		>
			{/* Decorative gradient background blobb (optional, subtle) */}

			<div className="p-4 space-y-4 relative z-10">
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
				<div className="relative mt-auto">
					<div className="relative z-20 text-sm text-muted-foreground/80 line-clamp-3 min-h-[4.5em] italic bg-muted/50 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-sm">
						{snippet || "No preview available."}
					</div>
					{/* Blur overlay for the footer area below */}
					<div className="absolute -bottom-12 inset-x-0 h-16 bg-background/5 backdrop-blur-[2px] pointer-events-none z-10" />
				</div>
			</div>

			{/* Footer / Actions Section */}
			<div className="px-4 pb-4 relative z-10">
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
								onOpen();
							}}
							className="h-8 w-8 text-muted-foreground hover:text-primary"
							aria-label={`Edit cover letter for ${companyName}`}
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
									aria-label={`Delete cover letter for ${companyName}`}
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
										"{companyName}" and its history.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={onDelete}
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
				onClick={onOpen}
				aria-hidden="true"
			/>
		</div>
	);
}
