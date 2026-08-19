"use client";

import { PALETTE_SURFACES } from "@/lib/surfaces";
import { useOs } from "@/lib/os-context";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setSurface, surface } = useOs();

  const surfaces = PALETTE_SURFACES.filter((item) => item.hint === "surface");
  const modules = PALETTE_SURFACES.filter((item) => item.hint === "module");

  return (
    <CommandDialog
      open={paletteOpen}
      onOpenChange={setPaletteOpen}
      title="Command palette"
      description="Jump to a surface or module"
      showCloseButton={false}
    >
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>no matches</CommandEmpty>
        <CommandGroup heading="Surfaces">
          {surfaces.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.id}`}
              onSelect={() => setSurface(item.id)}
            >
              {item.label}
              <CommandShortcut>
                {item.id === surface ? "open" : "go"}
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Modules">
          {modules.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.id} module`}
              onSelect={() => setSurface(item.id)}
            >
              {item.label}
              <CommandShortcut>
                {item.id === surface ? "open" : "module"}
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
