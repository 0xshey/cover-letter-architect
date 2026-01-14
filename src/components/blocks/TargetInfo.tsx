"use client";

import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TargetInfoForm() {
	const { targetInfo, setTargetInfo } = useAppStore();

	return (
		<div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
			<h3 className="text-sm font-semibold">Target Application</h3>
			<div className="grid gap-3">
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
					<Label htmlFor="addressee" className="text-xs">
						Addressee (Optional)
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
