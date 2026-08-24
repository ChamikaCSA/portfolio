"use client";

import { Command } from "lucide-react";
import { profile } from "@/content/profile";
import { useOs } from "@/lib/os-context";
import { menuAppName } from "@/lib/surfaces";
import { useColomboTime } from "@/lib/use-colombo-time";
import { usePaletteShortcut } from "@/lib/use-palette-shortcut";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Badge } from "@/components/ui/badge";
import { HyperText } from "@/components/ui/hyper-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

const menuTrigger =
  "pointer-events-auto cursor-pointer rounded-sm px-1.5 py-0.5 font-mono text-[11px] tracking-[0.16em] outline-hidden transition-colors hover:text-accent data-[state=open]:bg-line data-[state=open]:text-fg";

const LOGO_CHARS = "01<>_|/#$@".split("");

function OsLogo({ name }: { name: string }) {
  const { booted } = useOs();
  const reduced = useReducedMotion();

  if (reduced || !booted) return name;

  return (
    <HyperText
      as="span"
      delay={80}
      duration={700}
      animateOnHover
      uppercase={false}
      characterSet={LOGO_CHARS}
      className="inline-flex overflow-visible py-0 text-[11px] font-normal tracking-[0.16em]"
    >
      {name}
    </HyperText>
  );
}

export function MenuBar() {
  const { setPaletteOpen, setSurface, surface } = useOs();
  const clock = useColomboTime();
  const shortcut = usePaletteShortcut();
  const app = menuAppName(surface);

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
    <Tooltip delayDuration={120}>
      <TooltipTrigger
        type="button"
        aria-label={`${clock}, ${profile.location}`}
        className="cursor-default font-mono text-[11px] tracking-[0.12em] text-dim uppercase outline-hidden transition-colors hover:text-fg"
      >
        {clock}
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end">
        {profile.location}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top,0px)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-full">
        <ProgressiveBlur
          position="top"
          height="100%"
          blurLevels={[1, 2, 3, 4, 6, 8, 10, 14]}
        />
      </div>
      <div
        className="relative z-20 flex h-12 w-full items-center justify-between px-2 text-[11px] tracking-[0.16em] text-muted uppercase sm:px-3"
      >
        <div className="flex min-w-0 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`${profile.osName} menu`}
              className={cn(menuTrigger, "text-fg/90 normal-case")}
            >
              <OsLogo name={profile.osName} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setSurface("home")}>
                  Home
                  <DropdownMenuShortcut>esc</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSurface("about")}>
                  About
                  <DropdownMenuShortcut>A</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setSurface("terminal")}>
                  Terminal
                  <DropdownMenuShortcut>T</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSurface("settings")}>
                  Settings
                  <DropdownMenuShortcut>,</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {app && (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`${app} menu`}
                className={cn(
                  menuTrigger,
                  "font-medium text-fg normal-case tracking-[0.14em]",
                )}
              >
                {app}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
                <DropdownMenuItem onSelect={() => setSurface("home")}>
                  Quit {app}
                  <DropdownMenuShortcut>esc</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="pointer-events-auto hidden items-center gap-3 font-mono sm:flex">
          <Badge
            asChild
            variant="outline"
            className="group cursor-pointer gap-2 overflow-visible border-line glass font-mono text-[10px] tracking-[0.16em] text-muted uppercase transition-[color,border-color,background-color] [@media(hover:hover)]:hover:border-accent [@media(hover:hover)]:hover:bg-wash [@media(hover:hover)]:hover:text-fg"
          >
            <button
              type="button"
              onClick={() => setSurface("compose")}
              aria-label={`${profile.availability}, open compose`}
            >
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] transition-[transform,box-shadow] [@media(hover:hover)]:group-hover:scale-125 [@media(hover:hover)]:group-hover:shadow-[0_0_16px_var(--accent)]" />
              <AnimatedShinyText className="mx-0 max-w-none font-mono text-[10px] tracking-[0.16em] text-muted uppercase transition-colors [@media(hover:hover)]:group-hover:text-fg">
                {profile.availability}
              </AnimatedShinyText>
            </button>
          </Badge>
          {palette}
          <ThemeToggle />
          {status}
        </div>

        <div className="pointer-events-auto flex items-center gap-3 font-mono sm:hidden">
          <button
            type="button"
            onClick={() => setSurface("compose")}
            className="flex cursor-pointer items-center gap-1.5 outline-hidden transition-transform [@media(hover:hover)]:hover:scale-110"
            aria-label={`${profile.availability}, open compose`}
          >
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)] transition-shadow [@media(hover:hover)]:hover:shadow-[0_0_16px_var(--accent)]" />
            <span className="sr-only">{profile.availability}</span>
          </button>
          {palette}
          <ThemeToggle />
          {status}
        </div>
        <span className="sr-only">current surface {surface}</span>
      </div>
    </header>
  );
}
