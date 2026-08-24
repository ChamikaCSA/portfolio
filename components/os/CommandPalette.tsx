"use client";

import {
  Box,
  Briefcase,
  House,
  Layers,
  PenLine,
  ScrollText,
  Settings,
  SquareTerminal,
  User,
  type LucideIcon,
} from "lucide-react";
import { PALETTE_SURFACES, shortcutForSurface } from "@/lib/surfaces";
import { useOs } from "@/lib/os-context";
import { usePaletteShortcut } from "@/lib/use-palette-shortcut";
import {
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const ICONS: Record<string, LucideIcon> = {
  home: House,
  work: Briefcase,
  log: ScrollText,
  stack: Layers,
  compose: PenLine,
  about: User,
  terminal: SquareTerminal,
  settings: Settings,
};

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setSurface, surface } = useOs();
  const paletteKey = usePaletteShortcut();

  const surfaces = PALETTE_SURFACES.filter((item) => item.hint === "surface");
  const modules = PALETTE_SURFACES.filter((item) => item.hint === "module");

  return (
    <CommandDialog
      open={paletteOpen}
      onOpenChange={setPaletteOpen}
      title="Command palette"
      description="Jump to a surface or module"
    >
      <CommandInput placeholder="Type a command" />
      <CommandList>
        <CommandEmpty>no matches</CommandEmpty>
        <CommandGroup heading="Surfaces">
          {surfaces.map((item) => {
            const Icon = ICONS[item.id] ?? Box;
            const shortcut = shortcutForSurface(item.id);
            const current = item.id === surface;

            return (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.id} ${shortcut ?? ""}`}
                onSelect={() => setSurface(item.id)}
              >
                <Icon strokeWidth={1.75} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {current ? (
                  <CommandShortcut className="border-accent/40 text-accent">
                    open
                  </CommandShortcut>
                ) : shortcut ? (
                  <CommandShortcut>{shortcut}</CommandShortcut>
                ) : null}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Modules">
          {modules.map((item) => {
            const current = item.id === surface;

            return (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.id} module`}
                onSelect={() => setSurface(item.id)}
              >
                <Box strokeWidth={1.75} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <CommandShortcut>{current ? "open" : "module"}</CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
          {paletteKey}
        </span>
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
          <span>
            <CommandShortcut className="ml-0">enter</CommandShortcut>
            <span className="ml-1.5">open</span>
          </span>
          <span>
            <CommandShortcut className="ml-0">esc</CommandShortcut>
            <span className="ml-1.5">close</span>
          </span>
        </div>
      </CommandFooter>
    </CommandDialog>
  );
}
