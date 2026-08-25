"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      loop
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-transparent text-fg",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        from="top"
        placement="top"
        className={cn(
          "top-[max(4.75rem,calc(env(safe-area-inset-top)+3.25rem))] gap-0 overflow-hidden p-0 sm:max-w-lg",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-12 items-center gap-2.5 border-b border-line px-3.5"
    >
      <SearchIcon className="size-3.5 shrink-0 text-dim" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-12 w-full rounded-none bg-transparent py-3 font-mono text-base tracking-[0.08em] text-fg outline-hidden placeholder:text-dim disabled:cursor-not-allowed disabled:opacity-50 sm:text-[12px]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[min(22rem,calc(100dvh-14rem))] scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain p-1.5",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "py-8 text-center font-mono text-[11px] tracking-[0.14em] text-dim uppercase",
        className
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-fg **:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:text-[10px] **:[[cmdk-group-heading]]:font-normal **:[[cmdk-group-heading]]:tracking-[0.22em] **:[[cmdk-group-heading]]:text-dim **:[[cmdk-group-heading]]:uppercase",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px bg-line", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 font-mono text-[11px] tracking-[0.14em] text-muted outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-fg/[0.07] data-[selected=true]:text-fg data-[selected=true]:dark:bg-fg/8 focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-dim data-[selected=true]:[&_svg:not([class*='text-'])]:text-fg",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto inline-flex min-w-5 items-center justify-center rounded-sm border border-line bg-wash/80 px-1 py-px font-mono text-[9px] tracking-[0.14em] text-dim uppercase",
        className
      )}
      {...props}
    />
  )
}

function CommandFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex items-center justify-between gap-3 border-t border-line px-3.5 py-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandFooter,
}
