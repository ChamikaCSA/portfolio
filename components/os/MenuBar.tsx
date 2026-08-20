"use client";

import { Command } from "lucide-react";
import { profile } from "@/content/profile";
import { useOs } from "@/lib/os-context";
import { useColomboTime } from "@/lib/use-colombo-time";
import { usePaletteShortcut } from "@/lib/use-palette-shortcut";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/os/ThemeToggle";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export function MenuBar() {
  const { setPaletteOpen, setSurface, surface } = useOs();
  const clock = useColomboTime();
  const shortcut = usePaletteShortcut();
  const place = profile.location.split(",")[1]?.trim() ?? profile.location;

  const palette = (
    <Tooltip delayDuration={120}>
      <TooltipTrigger
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-sm bg-transparent text-muted transition-colors hover:text-accent"
        aria-label={`Command palette (${shortcut})`}
      >
        <Command className="size-3.5" strokeWidth={2} />
      </TooltipTrigger>
      <TooltipContent side="bottom">
        command <span className="ml-1.5 text-dim">{shortcut}</span>
      </TooltipContent>
    </Tooltip>
  );

  const status = (
    <span className="text-dim normal-case tracking-[0.12em]">
      {place} <span className="uppercase">{clock}</span>
    </span>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div aria-hidden className="absolute inset-x-0 top-0 h-12">
        <ProgressiveBlur
          position="top"
          height="100%"
          blurLevels={[1, 2, 3, 4, 6, 8, 10, 14]}
        />
      </div>
      <div
        className="relative z-20 flex h-12 w-full items-center justify-between px-2 text-[11px] tracking-[0.16em] text-muted uppercase sm:px-3"
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`${profile.osName} menu`}
            className="pointer-events-auto cursor-pointer rounded-sm px-1.5 py-0.5 font-mono text-[11px] tracking-[0.16em] text-fg/90 normal-case outline-hidden transition-colors hover:text-accent data-[state=open]:bg-line data-[state=open]:text-fg"
          >
            {profile.osName}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" sideOffset={6}>
            <DropdownMenuItem onSelect={() => setSurface("home")}>
              Home
              <DropdownMenuShortcut>esc</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSurface("about")}>
              About
              <DropdownMenuShortcut>A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="pointer-events-auto hidden items-center gap-3 font-mono sm:flex">
          <Badge
            variant="outline"
            className="gap-2 border-line glass font-mono text-[10px] tracking-[0.16em] text-muted uppercase"
          >
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
            <AnimatedShinyText className="mx-0 max-w-none font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {profile.availability}
            </AnimatedShinyText>
          </Badge>
          {palette}
          <ThemeToggle />
          {status}
        </div>

        <div className="pointer-events-auto flex items-center gap-3 font-mono sm:hidden">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="sr-only">{profile.availability}</span>
          </span>
          {palette}
          <ThemeToggle />
          {status}
        </div>
        <span className="sr-only">current surface {surface}</span>
      </div>
    </header>
  );
}
