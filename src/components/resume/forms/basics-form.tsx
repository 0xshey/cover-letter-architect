"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeBasics } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface BasicsFormProps {
	basics: ResumeBasics;
	onChange: (field: keyof ResumeBasics, value: any) => void;
	onLocationChange: (
		field: keyof NonNullable<ResumeBasics["location"]>,
		value: string
	) => void;
	isOwner: boolean;
	isVisible?: boolean;
	onToggleVisibility?: (visible: boolean) => void;
}

export function BasicsForm({
	basics,
	onChange,
	onLocationChange,
	isOwner,
	isVisible = true,
	onToggleVisibility,
}: BasicsFormProps) {
	if (!isOwner && !isVisible) return null;

	return (
		<section
			className={cn(
				"w-full bg-muted/30 p-6 rounded-xl border space-y-6",
				!isVisible && "opacity-50 grayscale border-dashed"
			)}
		>
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold tracking-tight">
					Basic Information
				</h2>
				{isOwner && onToggleVisibility && (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onToggleVisibility(!isVisible)}
						className="h-8 w-8 text-muted-foreground hover:text-foreground"
					>
						{isVisible ? (
							<Eye className="w-4 h-4" />
						) : (
							<EyeOff className="w-4 h-4" />
						)}
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground uppercase tracking-wider">
						Full Name
					</Label>
					<Input
						value={basics.name || ""}
						onChange={(e) => onChange("name", e.target.value)}
						variant="ghost"
						className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
						placeholder="Your Name"
						disabled={!isOwner}
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground uppercase tracking-wider">
						Headline / Label
					</Label>
					<Input
						value={basics.label || ""}
						onChange={(e) => onChange("label", e.target.value)}
						variant="ghost"
						className="text-lg font-medium px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
						placeholder="Software Engineer"
						disabled={!isOwner}
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground uppercase tracking-wider">
						Email
					</Label>
					<Input
						value={basics.email || ""}
						onChange={(e) => onChange("email", e.target.value)}
						variant="ghost"
						className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
						placeholder="you@example.com"
						disabled={!isOwner}
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground uppercase tracking-wider">
						Phone
					</Label>
					<Input
						value={basics.phone || ""}
						onChange={(e) => onChange("phone", e.target.value)}
						variant="ghost"
						className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
						placeholder="+1 (555) 000-0000"
						disabled={!isOwner}
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground uppercase tracking-wider">
						Website
					</Label>
					<Input
						value={basics.url || ""}
						onChange={(e) => onChange("url", e.target.value)}
						variant="ghost"
						className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
						placeholder="https://yourwebsite.com"
						disabled={!isOwner}
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground uppercase tracking-wider">
						Location (City, Region, Country)
					</Label>
					<div className="flex gap-2">
						<Input
							value={basics.location?.city || ""}
							onChange={(e) =>
								onLocationChange("city", e.target.value)
							}
							variant="ghost"
							className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
							placeholder="City"
							disabled={!isOwner}
						/>
						<Input
							value={basics.location?.region || ""}
							onChange={(e) =>
								onLocationChange("region", e.target.value)
							}
							variant="ghost"
							className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
							placeholder="Region"
							disabled={!isOwner}
						/>
						<Input
							value={basics.location?.countryCode || ""}
							onChange={(e) =>
								onLocationChange("countryCode", e.target.value)
							}
							variant="ghost"
							className="px-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors w-20"
							placeholder="US"
							disabled={!isOwner}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-xs text-muted-foreground uppercase tracking-wider">
					Summary
				</Label>
				<Textarea
					value={basics.summary || ""}
					onChange={(e) => onChange("summary", e.target.value)}
					className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[100px] px-0"
					placeholder="A brief summary about yourself..."
					disabled={!isOwner}
				/>
			</div>
		</section>
	);
}
