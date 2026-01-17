"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Trash2, Edit, FileText, Loader2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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

interface CoverLetter {
	id: string;
	title: string;
	updated_at: string;
	target_info: any;
	blocks: any;
}

export function DashboardClient() {
	const router = useRouter();
	const {
		setTargetInfo,
		setBlocks,
		setCurrentLetter,
		session,
		setCurrentCoverLetterId,
	} = useAppStore();

	const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const fetchCoverLetters = async () => {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("cover_letters")
				.select("*")
				.order("updated_at", { ascending: false });

			if (!error && data) {
				setCoverLetters(data);
			}
			setIsLoading(false);
		};

		fetchCoverLetters();
	}, [supabase]);

	const handleDelete = async (id: string) => {
		const res = await fetch(`/api/cover-letters/${id}`, {
			method: "DELETE",
		});
		if (res.ok) {
			setCoverLetters((prev) => prev.filter((cl) => cl.id !== id));
		}
	};

	const handleLoad = async (cl: CoverLetter) => {
		try {
			// Optimistically set metadata
			setTargetInfo(cl.target_info);
			setBlocks(cl.blocks);
			setCurrentCoverLetterId(cl.id);

			// Fetch full content (including latest generation)
			const res = await fetch(`/api/cover-letters/${cl.id}`);
			if (res.ok) {
				const { coverLetter } = await res.json();
				setCurrentLetter(coverLetter.markdown || null);
			}

			router.push("/");
		} catch (error) {
			console.error("Failed to load cover letter details", error);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="container max-w-4xl mx-auto py-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						My Cover Letters
					</h1>
					<p className="text-muted-foreground">
						Manage your saved letters and configurations.
					</p>
				</div>
				<Button onClick={() => router.push("/")}>
					<Plus className="mr-2 h-4 w-4" /> New Letter
				</Button>
			</div>

			{coverLetters.length === 0 ? (
				<div className="text-center py-12 border rounded-lg bg-muted/10">
					<h3 className="text-lg font-medium">
						No cover letters yet
					</h3>
					<p className="text-muted-foreground mb-4">
						Create your first cover letter to get started.
					</p>
					<Button onClick={() => router.push("/")}>
						Go to Editor
					</Button>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{coverLetters.map((cl) => (
						<Card key={cl.id} className="group relative">
							<CardHeader>
								<CardTitle className="truncate pr-8">
									{cl.title}
								</CardTitle>
								<CardDescription>
									{cl.target_info.companyName} •{" "}
									{cl.target_info.roleTitle}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-xs text-muted-foreground">
									Updated{" "}
									{formatDistanceToNow(
										new Date(cl.updated_at),
										{ addSuffix: true }
									)}
								</p>
							</CardContent>
							<CardFooter className="flex justify-between gap-2">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => handleLoad(cl)}
								>
									<Edit className="mr-2 h-4 w-4" /> Open
								</Button>

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="text-muted-foreground hover:text-destructive"
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
												This action cannot be undone.
												This will permanently delete "
												{cl.title}" and its history.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() =>
													handleDelete(cl.id)
												}
												className="bg-destructive hover:bg-destructive/90"
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
