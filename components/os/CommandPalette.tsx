"use client";

import { Box } from "lucide-react";
import { PALETTE_APPS, shortcutForApp } from "@/lib/apps";
import { useOs } from "@/lib/os-context";
import { usePaletteShortcut } from "@/lib/use-palette-shortcut";
import { APP_ICONS } from "@/components/os/app-icons";
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

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setApp, app } = useOs();
  const paletteKey = usePaletteShortcut();

  const apps = PALETTE_APPS.filter((item) => item.hint === "app");
  const projects = PALETTE_APPS.filter((item) => item.hint === "project");

  return (
    <CommandDialog
      open={paletteOpen}
      onOpenChange={setPaletteOpen}
      title="Command palette"
      description="Jump to an app or project"
    >
      <CommandInput placeholder="Type a command" />
      <CommandList>
        <CommandEmpty>no matches</CommandEmpty>
        <CommandGroup heading="Apps">
          {apps.map((item) => {
            const Icon = APP_ICONS[item.id] ?? Box;
            const shortcut = shortcutForApp(item.id);
            const current = item.id === app;

            return (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.id} ${shortcut ?? ""}`}
                onSelect={() => setApp(item.id)}
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
        <CommandGroup heading="Projects">
          {projects.map((item) => {
            const current = item.id === app;

            return (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.id} project`}
                onSelect={() => setApp(item.id)}
              >
                <Box strokeWidth={1.75} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {current ? (
                  <CommandShortcut className="border-flare/40 text-flare">
                    open
                  </CommandShortcut>
                ) : (
                  <CommandShortcut>project</CommandShortcut>
                )}
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
