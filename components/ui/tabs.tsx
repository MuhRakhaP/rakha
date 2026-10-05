"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "cn"

function Tabs({
  className,
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-full flex-wrap gap-1.5 border-b border-border pb-2",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center rounded-t-md border-b-2 border-transparent px-3 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        // The active tab gets a thick brand underline that sits exactly on
        // the list's bottom border (-mb-2 against the list's pb-2), plus a
        // soft wash, so the selected step is obvious at a glance. Base UI
        // marks the active tab with data-composite-item-active, not
        // data-selected.
        // `text-brand-lift` on `bg-brand-weak`: `text-brand` measures 4.25 there
        // and fails AA for the 14px tab label. The active walkthrough tab is one
        // of the three places the accent sits on its own tint.
        "-mb-2 data-composite-item-active:border-brand data-composite-item-active:bg-brand-weak data-composite-item-active:text-brand-lift",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
