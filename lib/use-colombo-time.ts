"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/content/profile";

function formatColombo(date: Date) {
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${day} ${time}`;
}

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

export function useColomboTime() {
  return useSyncExternalStore(
    subscribe,
    () => formatColombo(new Date()),
    () => "— —",
  );
}
