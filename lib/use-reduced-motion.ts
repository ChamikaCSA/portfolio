"use client";

import { useSyncExternalStore } from "react";

function subscribeReduced(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function subscribeFine(onStoreChange: () => void) {
  const media = window.matchMedia("(pointer: fine)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReduced() {
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
