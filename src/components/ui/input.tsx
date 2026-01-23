import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
	"flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "",
				ghost: "border-transparent bg-transparent shadow-none hover:bg-muted/50 focus-visible:bg-background focus-visible:border-input focus-visible:shadow-sm",
				secondary:
					"bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-background focus-visible:border-input",
				primary:
					"bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30 focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-primary/40",
			},
			size: {
				default: "h-10 px-3 py-2",
				sm: "h-9 px-3 text-xs",
				lg: "h-11 px-8 rounded-md",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, variant, size, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input, inputVariants };
