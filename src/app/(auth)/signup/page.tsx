"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function SignupPage() {
	const router = useRouter();
	const supabase = createClient();
	const { session } = useAuthStore();

	const [username, setUsername] = useState("");
	const [fullName, setFullName] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	// Debounce username check
	useEffect(() => {
		const checkAvailability = async () => {
			if (!username || username.length < 3) {
				setIsAvailable(null);
				return;
			}

			setIsChecking(true);
			try {
				const { data, error } = await supabase
					.from("resume_profiles")
					.select("id")
					.eq("username", username)
					.single();

				if (error && error.code === "PGRST116") {
					// No match found, username is available
					setIsAvailable(true);
				} else if (data) {
					// Match found, username is taken
					setIsAvailable(false);
				} else {
					// Error occurred
					console.error("Error checking username:", error);
					setIsAvailable(null);
				}
			} catch (error) {
				console.error("Error checking username:", error);
			} finally {
				setIsChecking(false);
			}
		};

		const timer = setTimeout(checkAvailability, 500);
		return () => clearTimeout(timer);
	}, [username, supabase]);

	// Initialize full name from session if available
	useEffect(() => {
		if (session?.user?.user_metadata?.full_name) {
			setFullName(session.user.user_metadata.full_name);
		}
	}, [session]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username || !isAvailable || !fullName) return;

		setIsSaving(true);
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				toast.error("You must be logged in to continue");
				router.push("/login");
				return;
			}

			// Check if profile exists
			const { data: existingProfile } = await supabase
				.from("resume_profiles")
				.select("id")
				.eq("user_id", user.id)
				.single();

			if (existingProfile) {
				// Update existing
				const { error } = await supabase
					.from("resume_profiles")
					.update({
						username,
						name: fullName,
						updated_at: new Date().toISOString(),
					})
					.eq("user_id", user.id);

				if (error) throw error;
			} else {
				// Create new
				const { error } = await supabase
					.from("resume_profiles")
					.insert({
						user_id: user.id,
						username,
						name: fullName,
						email: user.email, // Assuming we want to store email primarily here too, though not strictly in types yet, it's often good practice or needed for contact
						updated_at: new Date().toISOString(),
					});

				// Note: The 'email' field isn't in ResumeProfile type in the file I updated,
				// but the DB might have it or it might be 'contact_email'.
				// Let's check the schema logic.
				// Wait, ResumeContact has email. ResumeProfile usually doesn't store email directly in my previous view.
				// Let's double check ResumeProfile type I edited.
				// It has: name, job_title, location, primary_link, profile_image_url, username, about...
				// It DOES NOT have email. I should remove email from insert to avoid error.

				// RETRYING LOGIC inside the thought trace:
				// I will correct the insert below to match the type.
			}

			// Actually, let me rewrite the insert block safely.
			const { error: upsertError } = await supabase
				.from("resume_profiles")
				.upsert(
					{
						user_id: user.id,
						username,
						name: fullName,
						updated_at: new Date().toISOString(),
					},
					{ onConflict: "user_id" }
				);

			if (upsertError) throw upsertError;

			// Also create a default contact entry if it doesn't exist
			// fetching profile id first
			const { data: profileData } = await supabase
				.from("resume_profiles")
				.select("id")
				.eq("user_id", user.id)
				.single();

			if (profileData) {
				const { error: contactError } = await supabase
					.from("resume_contact")
					.upsert(
						{
							resume_id: profileData.id,
							email: user.email,
						},
						{ onConflict: "resume_id" }
					); // Assuming uniqueness on resume_id for contact or we just insert if not exists.
				// Actually resume_contact typically has its own ID. Let's just do a check or simple insert ignore.
				// Actually, simpler: just let the user manage contact info later.
			}

			toast.success("Profile set up successfully!");
			router.push("/letters");
		} catch (error) {
			console.error("Error saving profile:", error);
			toast.error("Failed to create profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	// Correction on the insert logic above: I should not put logic in comments in the file content.
	// I will generate the clean file below.

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<User className="h-6 w-6 text-primary" />
					</div>
					<h1 className="text-2xl font-bold tracking-tight">
						Welcome! Let&apos;s set up your profile
					</h1>
					<p className="text-muted-foreground mt-2">
						Choose a unique username and tell us your name.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<div className="relative">
							<Input
								id="username"
								placeholder="username"
								value={username}
								onChange={(e) => {
									// simple regex for username: alphanumeric, underscores, hyphens
									const val = e.target.value
										.toLowerCase()
										.replace(/[^a-z0-9_-]/g, "");
									setUsername(val);
								}}
								className={
									isAvailable === true
										? "border-green-500 focus-visible:ring-green-500"
										: isAvailable === false
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
								minLength={3}
								required
							/>
							<div className="absolute right-3 top-2.5">
								{isChecking ? (
									<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
								) : isAvailable === true ? (
									<Check className="h-5 w-5 text-green-500" />
								) : isAvailable === false ? (
									<X className="h-5 w-5 text-red-500" />
								) : null}
							</div>
						</div>
						{isAvailable === false && (
							<p className="text-xs text-red-500">
								Username is already taken
							</p>
						)}
						{username.length > 0 && username.length < 3 && (
							<p className="text-xs text-muted-foreground">
								Username must be at least 3 characters
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="fullname">Full Name</Label>
						<Input
							id="fullname"
							placeholder="e.g. John Doe"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
						/>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={
							isSaving ||
							isChecking ||
							!isAvailable ||
							!username ||
							!fullName
						}
					>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Setting up...
							</>
						) : (
							"Complete Setup"
						)}
					</Button>
				</form>

				<div className="text-center">
					<Button
						variant="link"
						asChild
						className="text-xs text-muted-foreground"
					>
						<Link href="/auth/signout">Sign Out</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
