"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
	size?: number;
	className?: string;
}

export function ThemeToggle({ size = 16, className }: ThemeToggleProps) {
	const { theme, setTheme, resolvedTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			className={className}
			onClick={() =>
				setTheme(resolvedTheme === "light" ? "dark" : "light")
			}
			title="Toggle Theme"
		>
			<Sun
				className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				style={{ width: size, height: size }}
			/>
			<Moon
				className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				style={{ width: size, height: size }}
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
