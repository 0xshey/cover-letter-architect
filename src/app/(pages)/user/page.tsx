"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Profile } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserPage() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);
	const { session } = useAuthStore();

	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	// Username state
	const [username, setUsername] = useState("");
	const [originalUsername, setOriginalUsername] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isUsernameAvailable, setIsUsernameAvailable] = useState<
		boolean | null
	>(true);
	const [isSavingUsername, setIsSavingUsername] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (!session?.user) return;

			try {
				const { data: profileData, error: profileError } =
					await supabase
						.from("profiles")
						.select("*")
						.eq("id", session.user.id) // profiles.id is linked to auth.users.id
						.single();

				if (profileError && profileError.code !== "PGRST116") {
					throw profileError;
				}

				if (profileData) {
					setProfile(profileData);
					setUsername(profileData.username || "");
					setOriginalUsername(profileData.username || "");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
				toast.error("Failed to load user data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [session, supabase]);

	// Check username availability
	useEffect(() => {
		const checkAvailability = async () => {
			if (
				!username ||
				username === originalUsername ||
				username.length < 3
			) {
				setIsUsernameAvailable(true); // Technically available if it's your own
				return;
			}

			setIsCheckingUsername(true);
			try {
				const { data, error } = await supabase
					.from("profiles")
					.select("id")
					.eq("username", username)
					.single();

				if (error && error.code === "PGRST116") {
					setIsUsernameAvailable(true);
				} else if (data) {
					setIsUsernameAvailable(false);
				}
			} catch (error) {
				console.error("Error checking username:", error);
			} finally {
				setIsCheckingUsername(false);
			}
		};

		const timer = setTimeout(checkAvailability, 500);
		return () => clearTimeout(timer);
	}, [username, originalUsername, supabase]);

	const handleUpdateUsername = async () => {
		if (
			!profile ||
			!username ||
			username === originalUsername ||
			!isUsernameAvailable
		)
			return;

		setIsSavingUsername(true);
		try {
			const { error } = await supabase
				.from("profiles")
				.update({ username, updated_at: new Date().toISOString() })
				.eq("id", profile.id);

			if (error) throw error;

			const updatedProfile = {
				...profile,
				username,
				updated_at: new Date().toISOString(),
			};
			setProfile(updatedProfile);
			setOriginalUsername(username);
			toast.success("Username updated");
		} catch (error) {
			console.error("Error updating username:", error);
			toast.error("Failed to update username");
		} finally {
			setIsSavingUsername(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px]">
				<p>Profile not found. Please try logging in again.</p>
				<Button
					onClick={() => router.push("/login")}
					variant="outline"
					className="mt-4"
				>
					Go to Login
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-2xl mx-auto py-8 px-4 space-y-8">
			<div className="flex items-center gap-3 mb-6 border-b pb-4">
				<div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
					<UserIcon className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h1 className="text-2xl font-bold">User Profile</h1>
					<p className="text-muted-foreground">
						Manage your personal information and contact details
					</p>
				</div>
			</div>

			{/* Username Section */}
			<div className="space-y-4 bg-muted/30 p-6 rounded-xl border">
				<div className="space-y-2">
					<Label htmlFor="username">Username</Label>
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Input
								id="username"
								value={username}
								onChange={(e) => {
									const val = e.target.value
										.toLowerCase()
										.replace(/[^a-z0-9_-]/g, "");
									setUsername(val);
								}}
								className={
									!isUsernameAvailable &&
									username !== originalUsername
										? "border-red-500 focus-visible:ring-red-500"
										: ""
								}
								minLength={3}
							/>
							<div className="absolute right-3 top-2.5">
								{isCheckingUsername ? (
									<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
								) : username !== originalUsername &&
								  isUsernameAvailable ? (
									<Check className="h-5 w-5 text-green-500" />
								) : !isUsernameAvailable &&
								  username !== originalUsername ? (
									<X className="h-5 w-5 text-red-500" />
								) : null}
							</div>
						</div>
						<Button
							onClick={handleUpdateUsername}
							disabled={
								username === originalUsername ||
								!isUsernameAvailable ||
								isCheckingUsername ||
								isSavingUsername ||
								username.length < 3
							}
						>
							{isSavingUsername ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Save"
							)}
						</Button>
					</div>
					{!isUsernameAvailable && username !== originalUsername && (
						<p className="text-xs text-red-500">
							Username is already taken
						</p>
					)}
					<p className="text-xs text-muted-foreground">
						Your unique username for your profile URL.
					</p>
				</div>
			</div>

			<div className="border rounded-xl p-6 bg-card flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold">Resume & Profile</h2>
					<p className="text-sm text-muted-foreground">
						Edit your resume content, experience, and education.
					</p>
				</div>
				<Button onClick={() => router.push(`/resume/${username}`)}>
					Go to Resume Editor
				</Button>
			</div>
		</div>
	);
}
