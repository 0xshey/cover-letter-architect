"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			// Layout & Flex
			"peer inline-flex h-4 w-8 shrink-0 px-0.5 cursor-pointer items-center rounded-full border border-foreground/60 transition-colors",
			// Focus & Accessibility
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			// States
			"disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-foreground/60 data-[state=unchecked]:bg-background",
			className
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				"pointer-events-none block h-2.5 w-3.5 rounded-full border-1 border-foreground shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-3 data-[state=checked]:bg-foreground/70 data-[state=checked]:border-foreground/20 data-[state=unchecked]:translate-x-0"
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
