"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DOCK_SURFACES,
  hrefForSurface,
  isProjectSurface,
  surfaceFromPathname,
} from "@/lib/surfaces";

type OsContextValue = {
  surface: string;
  setSurface: (id: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  booted: boolean;
  finishBoot: () => void;
};

const OsContext = createContext<OsContextValue | null>(null);
const BOOT_EVENT = "chamikaos-boot";
const BOOT_KEY = "chamikaos-booted";

function subscribeBoot(onStoreChange: () => void) {
  window.addEventListener(BOOT_EVENT, onStoreChange);
  return () => window.removeEventListener(BOOT_EVENT, onStoreChange);
}

function getBootSnapshot() {
  try {
    return sessionStorage.getItem(BOOT_KEY) === "1";
  } catch {
    return false;
  }
}

function getBootServerSnapshot() {
  return false;
}

export function OsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const surface = surfaceFromPathname(pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const booted = useSyncExternalStore(
    subscribeBoot,
    getBootSnapshot,
    getBootServerSnapshot,
  );

  const setSurface = useCallback(
    (id: string) => {
      setPaletteOpen(false);
      const href = hrefForSurface(id);
      if (href === pathname) return;
      router.push(href);
    },
    [pathname, router],
  );

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
      window.dispatchEvent(new Event(BOOT_EVENT));
    } catch {
      window.dispatchEvent(new Event(BOOT_EVENT));
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }

      if (event.key === "Escape") {
        if (paletteOpen) {
          setPaletteOpen(false);
          return;
        }
        if (isProjectSurface(surface)) {
          setSurface("work");
          return;
        }
        if (surface !== "home") {
          setSurface("home");
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        setSurface("home");
        return;
      }

      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        setSurface("about");
        return;
      }

      const dock = DOCK_SURFACES.find(
        (item) => item.shortcut.toLowerCase() === event.key.toLowerCase(),
      );
      if (dock) {
        event.preventDefault();
        setSurface(dock.id);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setSurface, surface]);

  const value = useMemo(
    () => ({
      surface,
      setSurface,
      paletteOpen,
      setPaletteOpen,
      booted,
      finishBoot,
    }),
    [booted, finishBoot, paletteOpen, setSurface, surface],
  );

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used within OsProvider");
  return ctx;
}
