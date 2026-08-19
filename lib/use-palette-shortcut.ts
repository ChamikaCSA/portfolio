"use client";

import { useSyncExternalStore } from "react";

const APPLE = /Mac|iPhone|iPad/;

function subscribe() {
  return () => {};
}

function getShortcut() {
  return APPLE.test(navigator.userAgent) ? "⌘K" : "Ctrl+K";
}

export function usePaletteShortcut() {
  return useSyncExternalStore(subscribe, getShortcut, () => "⌘K");
}
