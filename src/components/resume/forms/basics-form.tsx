"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeBasics } from "@/types/resume";
import { FormSection } from "./form-section";

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
	return (
		<FormSection
			title="Basic Information"
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
		>
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
		</FormSection>
	);
}
