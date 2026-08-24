"use client";

import { useSyncExternalStore } from "react";
import { readSettings, SETTINGS_EVENT } from "@/lib/os-settings";

function subscribeReduced(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  window.addEventListener(SETTINGS_EVENT, onStoreChange);
  return () => {
    media.removeEventListener("change", onStoreChange);
    window.removeEventListener(SETTINGS_EVENT, onStoreChange);
  };
}

function subscribeFine(onStoreChange: () => void) {
  const media = window.matchMedia("(pointer: fine)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReduced() {
  const effects = readSettings().effects;
  if (effects === "reduce") return true;
  if (effects === "full") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getFine() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, getReduced, () => false);
}

export function useFinePointer() {
  return useSyncExternalStore(subscribeFine, getFine, () => false);
}
