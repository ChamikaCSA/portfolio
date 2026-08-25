"use client";

import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useOs } from "@/lib/os-context";
import { useOsSettings } from "@/lib/os-settings";
import { appWindowKey } from "@/lib/apps";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AppWindow } from "@/components/os/AppWindow";
import { Boot } from "@/components/os/Boot";
import { CommandPalette } from "@/components/os/CommandPalette";
import { OsDock } from "@/components/os/Dock";
import { EtherBackdrop } from "@/components/os/EtherBackdrop";
import { MenuBar } from "@/components/os/MenuBar";
import { Home } from "@/components/apps/Home";

function FrostSync() {
  const { frost } = useOsSettings();
  const reduced = useReducedMotion();
  const live = frost && !reduced;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.frost = live ? "on" : "off";
    return () => {
      delete root.dataset.frost;
    };
  }, [live]);

  return null;
}

export function OsShell({ children }: { children: React.ReactNode }) {
  const { app, fullScreen } = useOs();
  const desktop = app === "home";

  return (
    <>
      <Boot />
      <FrostSync />
      <EtherBackdrop />
      <MenuBar />
      <OsDock />
      <CommandPalette />
      <main
        id="app"
        className="relative z-10 h-dvh overflow-hidden"
      >
        {desktop ? children : null}
        {!desktop && !fullScreen ? (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
            inert
          >
            <Home />
          </div>
        ) : null}
        <AnimatePresence>
          {!desktop && (
            <AppWindow key={appWindowKey(app)}>{children}</AppWindow>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
