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
					.from("profiles")
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
					// Treat error as 'unknown availability' but don't block user if it's transient?
					// Safer to assume unavailable or just null to not show red/green
					setIsAvailable(null);
				}
			} catch (error) {
				console.error("Error checking username:", error);
				setIsAvailable(null);
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

			// Upsert profile in 'profiles' table
			// Using 'id' as the user_id reference since it's commonly 1:1 with auth.users
			const { error: upsertError } = await supabase
				.from("profiles")
				.upsert(
					{
						id: user.id, // profiles.id usually matches auth.users.id
						username,
						full_name: fullName, // Assuming 'full_name' is the column, based on common patterns. If 'name', will need to adjust.
						updated_at: new Date().toISOString(),
						// email: user.email // Profiles might track email, or just rely on auth.users
					},
					{ onConflict: "id" }
				);

			if (upsertError) throw upsertError;

			// Check if a default resume exists, if not create one?
			// The new schema works with 'resumes' table.
			// Let's create an empty resume for the user so they have something to start with.
			const { data: existingResume } = await supabase
				.from("resumes")
				.select("id")
				.eq("user_id", user.id)
				.single();

			if (!existingResume) {
				const { error: resumeError } = await supabase
					.from("resumes")
					.insert({
						user_id: user.id,
						title: "My Resume",
						data: {
							basics: {
								name: fullName,
								email: user.email || "",
							},
						}, // Initialize with minimal data
					});

				if (resumeError) {
					console.error(
						"Error creating default resume:",
						resumeError
					);
					// Don't block signup success on resume creation failure, but good to know
				}
			}

			toast.success("Profile set up successfully!");
			router.push("/letters"); // Or /resume/[username] ?
		} catch (error) {
			console.error("Error saving profile:", error);
			toast.error("Failed to create profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

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
