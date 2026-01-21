"use client";

import { useTargetStore } from "@/store/useTargetStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PersonalDetailsEditor({ className }: { className?: string }) {
	const { targetInfo, setTargetInfo } = useTargetStore();

	return (
		<div
			className={cn(
				"space-y-4 p-4 border rounded-xl bg-background",
				className
			)}
		>
			<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
				<span className="h-2 w-2 rounded-full bg-blue-500" />
				Personal Details
			</h3>
			<div className="grid gap-4">
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
				<div className="grid grid-cols-2 gap-3">
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
								checked={targetInfo.isEmailEnabled !== false}
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
							className={cn(
								"h-8",
								targetInfo.isEmailEnabled === false &&
									"opacity-50"
							)}
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
								checked={targetInfo.isPhoneEnabled !== false}
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
							className={cn(
								"h-8",
								targetInfo.isPhoneEnabled === false &&
									"opacity-50"
							)}
							placeholder="(555) 123-4567"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3">
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
							className={cn(
								"h-8",
								targetInfo.isCityStateEnabled === false &&
									"opacity-50"
							)}
							placeholder="e.g. San Francisco, CA"
						/>
					</div>
					<div className="group relative grid gap-1.5">
						<div className="flex items-center justify-between">
							<Label htmlFor="portfolio" className="text-xs">
								Portfolio / LinkedIn
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
							className={cn(
								"h-8",
								targetInfo.isPortfolioUrlEnabled === false &&
									"opacity-50"
							)}
							placeholder="e.g. linkedin.com/in/jane"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
