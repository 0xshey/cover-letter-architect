import { cn } from "@/lib/utils";
import { ResumeBasics } from "@/types/resume";
import { FormSection } from "./form-section";
import { ResumeField } from "./resume-field";

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
			title="" // Basic Information (hidden)
			isOwner={isOwner}
			isVisible={isVisible}
			onToggleVisibility={onToggleVisibility}
		>
			<div className={cn("flex flex-col", isOwner && "gap-6")}>
				<ResumeField
					label="Full Name"
					value={basics.name || ""}
					onChange={(v) => onChange("name", v)}
					isOwner={isOwner}
					variant="primary"
					placeholder="Your Name"
					InputClassName="text-2xl font-semibold tracking-tight"
				/>

				<ResumeField
					label="Headline / Label"
					value={basics.label || ""}
					onChange={(v) => onChange("label", v)}
					isOwner={isOwner}
					variant="primary"
					placeholder="Software Engineer"
				/>

				<ResumeField
					label="Email"
					value={basics.email || ""}
					onChange={(v) => onChange("email", v)}
					isOwner={isOwner}
					placeholder="you@example.com"
				/>

				<ResumeField
					label="Phone"
					value={basics.phone || ""}
					onChange={(v) => onChange("phone", v)}
					isOwner={isOwner}
					placeholder="+1 (555) 000-0000"
				/>

				<ResumeField
					label="Website"
					value={basics.url || ""}
					onChange={(v) => onChange("url", v)}
					isOwner={isOwner}
					placeholder="https://yourwebsite.com"
				/>

				<div className="space-y-2">
					{/* Location fields need to be handled carefully as they are a group. 
                        We can use ResumeField for each, but maybe grouping them looks better?
                        Actually, individual fields are fine. Labels only show in edit mode.
                    */}
					<div className="flex gap-2">
						<ResumeField
							label="City"
							value={basics.location?.city || ""}
							onChange={(v) => onLocationChange("city", v)}
							isOwner={isOwner}
							placeholder="City"
							className="flex-1"
						/>
						<ResumeField
							label="Region"
							value={basics.location?.region || ""}
							onChange={(v) => onLocationChange("region", v)}
							isOwner={isOwner}
							placeholder="Region"
							className="flex-1"
						/>
						<ResumeField
							label="Country"
							value={basics.location?.countryCode || ""}
							onChange={(v) => onLocationChange("countryCode", v)}
							isOwner={isOwner}
							placeholder="US"
							className="w-20"
						/>
					</div>
				</div>
			</div>

			<ResumeField
				label="Summary"
				value={basics.summary || ""}
				onChange={(v) => onChange("summary", v)}
				isOwner={isOwner}
				variant="textarea"
				placeholder="A brief summary about yourself..."
				className="mt-6"
			/>
		</FormSection>
	);
}
