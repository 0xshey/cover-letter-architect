"use client";

import { Search, LayoutGrid, List as ListIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NewLetterButton } from "@/components/dashboard/new-letter-button";

interface LettersToolbarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	viewMode: "grid" | "list";
	onViewModeChange: (mode: "grid" | "list") => void;
}

export function LettersToolbar({
	searchQuery,
	onSearchChange,
	viewMode,
	onViewModeChange,
}: LettersToolbarProps) {
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-8 py-4 w-full">
			{/* Left: Search */}
			<div className="relative w-full md:max-w-sm">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary/50" />
				<Input
					placeholder="Search applications..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					variant="secondary"
					className="pl-9"
				/>
			</div>

			{/* Right: Toggles & New Button */}
			<div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
				<div className="bg-muted/50 p-1 rounded-lg border border-border/40">
					<ToggleGroup
						type="single"
						value={viewMode}
						onValueChange={(val: string) => {
							if (val) onViewModeChange(val as "grid" | "list");
						}}
						className="gap-0"
					>
						<ToggleGroupItem
							value="grid"
							aria-label="Grid View"
							size="sm"
							className="h-7 w-8 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md transition-all"
						>
							<LayoutGrid className="h-4 w-4" />
						</ToggleGroupItem>
						<ToggleGroupItem
							value="list"
							aria-label="List View"
							size="sm"
							className="h-7 w-8 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md transition-all"
						>
							<ListIcon className="h-4 w-4" />
						</ToggleGroupItem>
					</ToggleGroup>
				</div>

				<NewLetterButton className="shadow-sm" size="sm" />
			</div>
		</div>
	);
}
