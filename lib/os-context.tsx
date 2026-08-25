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
  APPS,
  appWindowKey,
  hrefForApp,
  isProject,
  appFromPathname,
} from "@/lib/apps";

type OsContextValue = {
  app: string;
  setApp: (id: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  booted: boolean;
  finishBoot: () => void;
  fullScreen: boolean;
  setFullScreen: (value: boolean | ((open: boolean) => boolean)) => void;
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
  const app = appFromPathname(pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const windowKey = appWindowKey(app);
  const booted = useSyncExternalStore(
    subscribeBoot,
    getBootSnapshot,
    getBootServerSnapshot,
  );

  const setApp = useCallback(
    (id: string) => {
      setPaletteOpen(false);
      const href = hrefForApp(id);
      if (href === pathname) return;
      router.push(href);
    },
    [pathname, router],
  );

  useEffect(() => {
    setFullScreen(true);
  }, [windowKey]);

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
        if (isProject(app)) {
          setApp("projects");
          return;
        }
        if (app !== "home") {
          setApp("home");
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
        setApp("home");
        return;
      }

      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        setApp("about");
        return;
      }

      const shortcutApp = APPS.find(
        (item) => item.shortcut.toLowerCase() === event.key.toLowerCase(),
      );
      if (shortcutApp) {
        event.preventDefault();
        setApp(shortcutApp.id);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [app, paletteOpen, setApp]);

  const value = useMemo(
    () => ({
      app,
      setApp,
      paletteOpen,
      setPaletteOpen,
      booted,
      finishBoot,
      fullScreen,
      setFullScreen,
    }),
    [app, booted, finishBoot, fullScreen, paletteOpen, setApp],
  );

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used within OsProvider");
  return ctx;
}
