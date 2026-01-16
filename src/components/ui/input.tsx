import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					// Layout & Sizing
					"flex max-h-6 w-full text-xs",
					// Styling
					"border border-transparent text-foreground/90 ring-offset-background font-medium",
					// Inputs & Placeholders
					"file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60",
					// Focus & States
					"focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
