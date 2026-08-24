"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { log } from "@/content/experience";
import { profile } from "@/content/profile";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { DottedMapSkeleton } from "@/components/ui/dotted-map-skeleton";
import { OsSpecularButton } from "@/components/ui/specular-button";
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

const degree = log.find((entry) => entry.id === "iit");

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
      {children}
    </p>
  );
}

function SurfaceLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      className="text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
    >
      {children}
    </Link>
  );
}

export function About() {
  const reduced = useReducedMotion();

  return (
    <section className={SURFACE_PAGE}>
      <TextAnimate
        as="h2"
        by="word"
        animation="blurInUp"
        startOnView={false}
        once
        className="font-serif text-4xl tracking-tight sm:text-5xl"
      >
        About
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {profile.availabilityDetail} Fullstack, web and mobile. The systems
          are in <SurfaceLink href="/work">Work</SurfaceLink>. The path is in{" "}
          <SurfaceLink href="/log">Log</SurfaceLink>.
        </p>
      </Stagger>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:gap-14">
        <div className="min-w-0 max-w-2xl">
          <Stagger delay={STAGGER * 2}>
            <p className="text-base leading-relaxed text-fg/90">
              {profile.manifesto} I am a Software Engineering undergraduate at
              IIT / University of Westminster, graduating {profile.graduation}.
            </p>
          </Stagger>

          <Stagger delay={STAGGER * 3}>
            <section className="mt-10">
              <Label>notes</Label>
              <ol className="mt-5 space-y-5">
                {profile.philosophy.map((line, index) => (
                  <li
                    key={line}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4"
                  >
                    <span
                      className={cn(
                        "font-mono text-[11px] tracking-[0.14em]",
                        index % 2 === 0 ? "text-accent" : "text-flare",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-serif text-xl leading-snug text-fg">
                      {line}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </Stagger>

          <Stagger delay={STAGGER * 5}>
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <LiquidButton
                asChild
                hoverScale={1.02}
                tapScale={0.98}
                className="font-mono text-[11px] font-normal tracking-[0.18em] uppercase"
              >
                <Link href="/compose">write</Link>
              </LiquidButton>
              <OsSpecularButton
                href={profile.resumePath}
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Download className="size-3.5" />
                  CV
                </span>
              </OsSpecularButton>
            </div>
          </Stagger>
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-4">
          <Stagger delay={STAGGER * 3}>
            <dl className="space-y-5">
              <Fact label="available" value={profile.availability} />
              {degree ? (
                <div>
                  <dt>
                    <Label>school</Label>
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href="/log"
                      className="text-[13px] text-muted transition-colors hover:text-accent"
                    >
                      {degree.title}
                    </Link>
                    <p className="mt-1 text-[12px] leading-relaxed text-dim">
                      IIT / University of Westminster
                    </p>
                  </dd>
                </div>
              ) : null}
              <Fact label="graduating" value={profile.graduation} />
            </dl>
          </Stagger>

          <Stagger delay={STAGGER * 4}>
            <section>
              <Label>based</Label>
              <div className="relative mt-3 overflow-hidden rounded-2xl border border-line bg-surface dark:bg-background">
                <div className="h-48 w-full text-fg/40 dark:text-fg/20 sm:h-56 mask-[radial-gradient(ellipse_at_center,black_42%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_78%)]">
                  <DottedMap
                    markers={locationMarker}
                    markerColor="var(--accent)"
                    pulse={!reduced}
                  />
                </div>
                <p className="absolute right-4 bottom-3 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {profile.location}
                </p>
              </div>
            </section>
          </Stagger>
        </aside>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>
        <Label>{label}</Label>
      </dt>
      <dd className="mt-1 text-[13px] text-muted">{value}</dd>
    </div>
  );
}
