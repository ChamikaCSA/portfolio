"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { profile } from "@/content/profile";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { useOs } from "@/lib/os-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { OsLabel } from "@/components/fx/OsLabel";
import {
  Stagger,
  STAGGER,
  STAGGER_DURATION,
  STAGGER_LEAD,
} from "@/components/fx/Stagger";
import { DottedMapSkeleton } from "@/components/ui/dotted-map-skeleton";
import { Highlighter } from "@/components/ui/highlighter";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextAnimate } from "@/components/ui/text-animate";

const DottedMap = dynamic(
  () => import("@/components/ui/dotted-map").then((mod) => mod.DottedMap),
  { ssr: false, loading: () => <DottedMapSkeleton /> },
);

const locationMarker = [
  {
    lat: profile.coordinates.lat,
    lng: profile.coordinates.lng,
    size: 0.55,
  },
];

const MAP_AFTER_ENTER_MS =
  (STAGGER * (3 + profile.philosophy.length) + STAGGER_LEAD + STAGGER_DURATION + 0.08) *
  1000;

function DeferredMap({ pulse, reduced }: { pulse: boolean; reduced: boolean }) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(
      () => setLoad(true),
      reduced ? 0 : MAP_AFTER_ENTER_MS,
    );
    return () => window.clearTimeout(id);
  }, [reduced]);

  if (!load) return <DottedMapSkeleton />;

  return (
    <DottedMap
      markers={locationMarker}
      markerColor="var(--accent)"
      pulse={pulse}
    />
  );
}

export function About() {
  const { setSurface } = useOs();
  const reduced = useReducedMotion();

  return (
    <section className={SURFACE_PAGE}>
      <OsLabel text="about / system notes" />
      <TextAnimate
        as="h2"
        by="character"
        animation="blurInUp"
        className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl"
      >
        {profile.firstName}
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-6 text-base leading-relaxed text-muted">
          Software Engineering undergraduate graduating September 2026. I craft
          high-quality web and mobile applications with a core philosophy of{" "}
          <Highlighter
            action="highlight"
            color="#c8f542"
            isView
            delay={reduced ? 0 : STAGGER * 8 * 1000}
            animationDuration={reduced ? 0 : 700}
          >
            clean architecture
          </Highlighter>{" "}
          — turning complex problems into elegant, user-centric solutions.
        </p>
      </Stagger>

      <ul className="mt-10 space-y-3">
        {profile.philosophy.map((line, index) => (
          <li key={line}>
            <Stagger
              delay={STAGGER * (2 + index)}
              className="border-l border-accent/40 pl-4 font-serif text-xl leading-snug text-fg"
            >
              {line}
            </Stagger>
          </li>
        ))}
      </ul>

      <Stagger delay={STAGGER * (2 + profile.philosophy.length)}>
        <dl className="mt-12 space-y-5 font-mono text-[12px] tracking-[0.06em]">
          <div>
            <dt className="text-dim uppercase tracking-[0.16em]">education</dt>
            <dd className="mt-1 text-sm tracking-normal text-fg">
              BEng (Hons) Software Engineering · IIT / University of Westminster · 2022–present
            </dd>
          </div>
          <div>
            <dt className="text-dim uppercase tracking-[0.16em]">based</dt>
            <dd className="mt-3">
              <div className="relative overflow-hidden rounded-2xl border border-line glass">
                <div className="h-48 w-full text-fg/40 dark:text-fg/20 sm:h-56 [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_78%)]">
                  <DeferredMap pulse={!reduced} reduced={reduced} />
                </div>
                <p className="absolute right-4 bottom-3 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {profile.location}
                </p>
              </div>
            </dd>
          </div>
        </dl>
      </Stagger>

      <Stagger delay={STAGGER * (3 + profile.philosophy.length)}>
        <InteractiveHoverButton
          type="button"
          onClick={() => setSurface("compose")}
          className="mt-12 h-11 rounded-2xl border border-line px-5 font-mono text-[11px] font-normal tracking-[0.2em] text-fg uppercase [&_svg]:size-3.5"
        >
          open compose
        </InteractiveHoverButton>
      </Stagger>
    </section>
  );
}
