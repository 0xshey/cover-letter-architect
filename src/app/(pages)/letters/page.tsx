import { createClient } from "@/lib/supabase/server";
import { LettersView } from "@/components/letters/letters-view";

export default async function DashboardPage() {
	const supabase = await createClient();
	const { data: coverLetters } = await supabase
		.from("cover_letters")
		.select("*")
		.order("updated_at", { ascending: false });

	return (
		<div className="h-full mt-40 container">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 px-2">
				<div className="space-y-1">
					<h1 className="text-4xl mb-2 font-bold tracking-tight text-foreground">
						My Cover Letters
					</h1>
					<p className="text-muted-foreground text-md">
						Manage your saved letters and tailored applications.
					</p>
				</div>
			</div>

			<div className="w-full max-h-full">
				<LettersView initialCoverLetters={coverLetters || []} />
			</div>
		</div>
	);
}
