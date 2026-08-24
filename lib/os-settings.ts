"use client";

import { useSyncExternalStore } from "react";

export const SETTINGS_KEY = "chamikaos-settings";
export const SETTINGS_EVENT = "chamikaos-settings";

export type EffectsPref = "system" | "full" | "reduce";

export type OsSettings = {
  effects: EffectsPref;
  dockMag: boolean;
  wallpaper: boolean;
  frost: boolean;
};

export const DEFAULT_SETTINGS: OsSettings = {
  effects: "system",
  dockMag: true,
  wallpaper: true,
  frost: true,
};

function parse(raw: string | null): OsSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const data = JSON.parse(raw) as Partial<OsSettings> & {
      motion?: EffectsPref;
    };
    const pref = data.effects ?? data.motion;
    return {
      effects: pref === "full" || pref === "reduce" ? pref : "system",
      dockMag: data.dockMag !== false,
      wallpaper: data.wallpaper !== false,
      frost: data.frost !== false,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

let cachedRaw: string | null | undefined;
let cachedValue: OsSettings = DEFAULT_SETTINGS;

export function readSettings(): OsSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    cachedValue = parse(raw);
    return cachedValue;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeSettings(next: OsSettings) {
  cachedValue = next;
  cachedRaw = JSON.stringify(next);
  try {
    localStorage.setItem(SETTINGS_KEY, cachedRaw);
  } catch {
    // private mode
  }
  window.dispatchEvent(new Event(SETTINGS_EVENT));
}

export function patchSettings(partial: Partial<OsSettings>) {
  writeSettings({ ...readSettings(), ...partial });
}

export function subscribeSettings(onStoreChange: () => void) {
  window.addEventListener(SETTINGS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(SETTINGS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot() {
  return DEFAULT_SETTINGS;
}

export function useOsSettings() {
  return useSyncExternalStore(
    subscribeSettings,
    readSettings,
    getServerSnapshot,
  );
}
