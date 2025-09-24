"use client"

import type * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Track
        "peer inline-flex h-[1.2rem] w-9 shrink-0 items-center rounded-full border transition-all outline-none shadow-xs",
        // Visible borders and better contrast in both themes
        "border-border focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
        // Checked/unchecked backgrounds
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted dark:data-[state=unchecked]:bg-muted/70",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={
          // Thumb with border for contrast in both themes
          "pointer-events-none block size-4 rounded-full border border-border ring-0 transition-transform " +
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 " +
          "data-[state=checked]:bg-primary-foreground data-[state=unchecked]:bg-background"
        }
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
