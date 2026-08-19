"use client";

import { useOs } from "@/lib/os-context";
import { Boot } from "@/components/os/Boot";
import { CommandPalette } from "@/components/os/CommandPalette";
import { OsDock } from "@/components/os/Dock";
import { EtherBackdrop } from "@/components/os/EtherBackdrop";
import { MenuBar } from "@/components/os/MenuBar";

export function OsShell({ children }: { children: React.ReactNode }) {
  const { surface } = useOs();

  return (
    <>
      <Boot />
      <EtherBackdrop />
      <MenuBar />
      <OsDock />
      <CommandPalette />
      <main
        id="surface"
        className={
          surface === "home"
            ? "relative z-10 h-dvh overflow-hidden"
            : "relative z-10 min-h-dvh pt-12 pb-24"
        }
      >
        {children}
      </main>
    </>
  );
}
