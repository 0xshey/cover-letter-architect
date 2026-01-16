"use client";

import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TargetInfoForm() {
	const { targetInfo, setTargetInfo } = useAppStore();

	return (
		<div className="space-y-6 border border-transparent transition-colors">
			{/* Personal Details Section (Moved to Top) */}
			<div className="space-y-3">
				<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					Your Details
				</h3>
				<div className="grid gap-6">
					<div className="grid gap-1.5">
						<Label htmlFor="authorName" className="text-xs">
							Full Name
						</Label>
						<Input
							id="authorName"
							value={targetInfo.authorName || ""}
							onChange={(e) =>
								setTargetInfo({ authorName: e.target.value })
							}
							className="h-8"
							placeholder="e.g. Jane Doe"
						/>
					</div>
					<div className="grid grid-cols-2 gap-1.5">
						<div className="group relative grid gap-1.5">
							<div className="flex items-center justify-between">
								<Label
									htmlFor="email"
									className="text-xs group-hover:text-foreground transition-colors"
								>
									Email
								</Label>
								<input
									type="checkbox"
									checked={
										targetInfo.isEmailEnabled !== false
									}
									onChange={(e) =>
										setTargetInfo({
											isEmailEnabled: e.target.checked,
										})
									}
									className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer accent-primary"
									title="Include in header"
								/>
							</div>
							<Input
								id="email"
								type="email"
								value={targetInfo.email || ""}
								onChange={(e) =>
									setTargetInfo({ email: e.target.value })
								}
								disabled={targetInfo.isEmailEnabled === false}
								className={`h-8 ${
									targetInfo.isEmailEnabled === false
										? "opacity-50"
										: ""
								}`}
								placeholder="jane@example.com"
							/>
						</div>
						<div className="group relative grid gap-1.5">
							<div className="flex items-center justify-between">
								<Label htmlFor="phone" className="text-xs">
									Phone
								</Label>
								<input
									type="checkbox"
									checked={
										targetInfo.isPhoneEnabled !== false
									}
									onChange={(e) =>
										setTargetInfo({
											isPhoneEnabled: e.target.checked,
										})
									}
									className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer accent-primary"
									title="Include in header"
								/>
							</div>
							<Input
								id="phone"
								type="tel"
								value={targetInfo.phone || ""}
								onChange={(e) =>
									setTargetInfo({ phone: e.target.value })
								}
								disabled={targetInfo.isPhoneEnabled === false}
								className={`h-8 ${
									targetInfo.isPhoneEnabled === false
										? "opacity-50"
										: ""
								}`}
								placeholder="(555) 123-4567"
							/>
						</div>
					</div>
					<div className="group relative grid gap-1.5">
						<div className="flex items-center justify-between">
							<Label htmlFor="cityState" className="text-xs">
								Location
							</Label>
							<input
								type="checkbox"
								checked={
									targetInfo.isCityStateEnabled !== false
								}
								onChange={(e) =>
									setTargetInfo({
										isCityStateEnabled: e.target.checked,
									})
								}
								className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer accent-primary"
								title="Include in header"
							/>
						</div>
						<Input
							id="cityState"
							value={targetInfo.cityState || ""}
							onChange={(e) =>
								setTargetInfo({ cityState: e.target.value })
							}
							disabled={targetInfo.isCityStateEnabled === false}
							className={`h-8 ${
								targetInfo.isCityStateEnabled === false
									? "opacity-50"
									: ""
							}`}
							placeholder="e.g. San Francisco, CA"
						/>
					</div>
					<div className="group relative grid gap-1.5">
						<div className="flex items-center justify-between">
							<Label htmlFor="portfolio" className="text-xs">
								Portfolio / LinkedIn (Optional)
							</Label>
							<input
								type="checkbox"
								checked={
									targetInfo.isPortfolioUrlEnabled !== false
								}
								onChange={(e) =>
									setTargetInfo({
										isPortfolioUrlEnabled: e.target.checked,
									})
								}
								className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer accent-primary"
								title="Include in header"
							/>
						</div>
						<Input
							id="portfolio"
							value={targetInfo.portfolioUrl || ""}
							onChange={(e) =>
								setTargetInfo({ portfolioUrl: e.target.value })
							}
							disabled={
								targetInfo.isPortfolioUrlEnabled === false
							}
							className={`h-8 ${
								targetInfo.isPortfolioUrlEnabled === false
									? "opacity-50"
									: ""
							}`}
							placeholder="e.g. linkedin.com/in/jane"
						/>
					</div>
				</div>
			</div>

			<div className="h-[1px] bg-border w-full" />

			{/* Target Job Details Section (Moved to Bottom) */}
			<div className="space-y-3">
				<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					Target Job
				</h3>
				<div className="grid gap-6">
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
							placeholder="e.g. Requisition #12345"
						/>
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
		</div>
	);
}
