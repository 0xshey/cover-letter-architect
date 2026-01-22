"use client";

import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import { ResumeProfile } from "@/types/resume";
import { EditableField } from "./editable-field";
import { cn } from "@/lib/utils";

interface ResumeHeaderProps {
	profile: ResumeProfile;
	isEditing: boolean;
	onUpdate: (updates: Partial<ResumeProfile>) => void;
}

export function ResumeHeader({
	profile,
	isEditing,
	onUpdate,
}: ResumeHeaderProps) {
	return (
		<header className="flex items-start gap-4 sm:gap-6 mb-8">
			{/* Profile Image */}
			<div className="relative shrink-0">
				<div
					className={cn(
						"w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-muted",
						isEditing && "ring-2 ring-primary/20 ring-offset-2"
					)}
				>
					{profile.profile_image_url ? (
						<Image
							src={profile.profile_image_url}
							alt={profile.name}
							width={80}
							height={80}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-muted-foreground">
							{profile.name?.charAt(0)?.toUpperCase() || "?"}
						</div>
					)}
				</div>
				{isEditing && (
					<button
						className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs hover:bg-primary/90 transition-colors"
						title="Change photo"
					>
						+
					</button>
				)}
			</div>

			{/* Profile Info */}
			<div className="flex-1 min-w-0">
				<EditableField
					value={profile.name}
					onSave={(name) => onUpdate({ name })}
					isEditing={isEditing}
					placeholder="Your Name"
					className="text-xl sm:text-2xl font-semibold text-foreground"
					as="h1"
				/>

				<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
					{/* Role */}
					<EditableField
						value={profile.job_title || ""}
						onSave={(job_title) => onUpdate({ job_title })}
						isEditing={isEditing}
						placeholder="Your Role"
					/>

					{/* Location */}
					{(profile.location || isEditing) && (
						<span className="flex items-center gap-1">
							<MapPin className="h-3 w-3" />
							<EditableField
								value={profile.location || ""}
								onSave={(location) => onUpdate({ location })}
								isEditing={isEditing}
								placeholder="Location"
							/>
						</span>
					)}
				</div>

				{/* Primary Link */}
				{(profile.primary_link || isEditing) && (
					<div className="mt-2">
						{isEditing ? (
							<EditableField
								value={profile.primary_link || ""}
								onSave={(primary_link) =>
									onUpdate({ primary_link })
								}
								isEditing={isEditing}
								placeholder="website.com"
								className="text-sm text-muted-foreground"
							/>
						) : (
							profile.primary_link && (
								<a
									href={
										profile.primary_link.startsWith("http")
											? profile.primary_link
											: `https://${profile.primary_link}`
									}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
								>
									{profile.primary_link.replace(
										/^https?:\/\//,
										""
									)}
									<ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
								</a>
							)
						)}
					</div>
				)}
			</div>
		</header>
	);
}
