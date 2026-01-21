"use client";

import { useTargetStore } from "@/store/useTargetStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RoleDetailsEditor({ className }: { className?: string }) {
	const { targetInfo, setTargetInfo } = useTargetStore();

	return (
		<div
			className={cn(
				"space-y-4 p-4 border rounded-xl bg-background",
				className
			)}
		>
			<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
				<span className="h-2 w-2 rounded-full bg-purple-500" />
				Target Role
			</h3>
			<div className="grid gap-4">
				<div className="grid grid-cols-2 gap-3">
					<div className="grid gap-1.5">
						<Label htmlFor="company" className="text-xs">
							Company Name
						</Label>
						<Input
							id="company"
							value={targetInfo.companyName}
							onChange={(e) =>
								setTargetInfo({ companyName: e.target.value })
							}
							className="h-8"
							placeholder="e.g. Acme Corp"
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="companyAddress" className="text-xs">
							Company Location
						</Label>
						<Input
							id="companyAddress"
							value={targetInfo.companyAddress || ""}
							onChange={(e) =>
								setTargetInfo({
									companyAddress: e.target.value,
								})
							}
							className="h-8"
							placeholder="e.g. New York, NY"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="grid gap-1.5">
						<Label htmlFor="role" className="text-xs">
							Role Title
						</Label>
						<Input
							id="role"
							value={targetInfo.roleTitle}
							onChange={(e) =>
								setTargetInfo({ roleTitle: e.target.value })
							}
							className="h-8"
							placeholder="e.g. Senior Product Designer"
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="jobId" className="text-xs">
							Job ID (Optional)
						</Label>
						<Input
							id="jobId"
							value={targetInfo.jobId || ""}
							onChange={(e) =>
								setTargetInfo({ jobId: e.target.value })
							}
							className="h-8"
							placeholder="e.g. #12345"
						/>
					</div>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="addressee" className="text-xs">
						To (Addressee)
					</Label>
					<Input
						id="addressee"
						value={targetInfo.addressee}
						onChange={(e) =>
							setTargetInfo({ addressee: e.target.value })
						}
						className="h-8"
						placeholder="e.g. Hiring Manager"
					/>
				</div>
			</div>
		</div>
	);
}
