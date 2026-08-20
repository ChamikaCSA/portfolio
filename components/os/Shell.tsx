"use client";

import { AnimatePresence } from "motion/react";
import { useOs } from "@/lib/os-context";
import { appWindowKey } from "@/lib/surfaces";
import { AppWindow } from "@/components/os/AppWindow";
import { Boot } from "@/components/os/Boot";
import { CommandPalette } from "@/components/os/CommandPalette";
import { OsDock } from "@/components/os/Dock";
import { EtherBackdrop } from "@/components/os/EtherBackdrop";
import { MenuBar } from "@/components/os/MenuBar";

export function OsShell({ children }: { children: React.ReactNode }) {
  const { surface } = useOs();
  const desktop = surface === "home";

  return (
    <>
      <Boot />
      <EtherBackdrop />
      <MenuBar />
      <OsDock />
      <CommandPalette />
      <main
        id="surface"
        className="relative z-10 h-dvh overflow-hidden"
      >
        <AnimatePresence>
          {!desktop && (
            <AppWindow key={appWindowKey(surface)}>{children}</AppWindow>
          )}
        </AnimatePresence>
        {desktop ? children : null}
      </main>
    </>
  );
}
