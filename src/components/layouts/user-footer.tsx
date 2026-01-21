"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function UserFooter() {
	const supabase = createClient();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		window.location.href = "/";
	};

	return (
		<div className="p-4 shrink-0 mt-auto">
			<div className="relative">
				<Button
					variant="ghost"
					className="w-full h-auto py-3 justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 group rounded-2xl"
					onClick={handleSignOut}
					title="Sign Out"
				>
					<LogOut className="h-6 w-6" />
				</Button>
			</div>
		</div>
	);
}
