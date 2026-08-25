"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Calendar, CircleDot, Download, GraduationCap, Mail, MapPin, Notebook } from "lucide-react";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { headingForApp, hrefForApp, APP_PAGE } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { Stagger, STAGGER, STAGGER_DURATION } from "@/components/fx/Stagger";
import { DottedMapSkeleton } from "@/components/ui/dotted-map-skeleton";
import { OsSpecularButton } from "@/components/ui/specular-button";
import { TextAnimate } from "@/components/ui/text-animate";

const DottedMap = dynamic(
  () => import("@/components/ui/dotted-map").then((mod) => mod.DottedMap),
  { ssr: false, loading: () => <DottedMapSkeleton /> },
);

const MAP_DEFER_MS = Math.round((STAGGER * 5 + STAGGER_DURATION) * 1000);

const locationMarker = [
  {
    lat: profile.coordinates.lat,
    lng: profile.coordinates.lng,
    size: 0.55,
  },
];

const degree = experience.find((entry) => entry.id === "iit");

function AboutMap({ pulse }: { pulse: boolean }) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let idle = 0;
    const timer = window.setTimeout(() => {
      if (typeof requestIdleCallback === "function") {
        idle = requestIdleCallback(() => setLoad(true), { timeout: 400 });
        return;
      }
      setLoad(true);
    }, MAP_DEFER_MS);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  if (!load) return <DottedMapSkeleton />;

  return (
    <Suspense fallback={<DottedMapSkeleton />}>
      <DottedMap
        markers={locationMarker}
        markerColor="var(--accent)"
        pulse={pulse}
      />
    </Suspense>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
      {children}
    </p>
  );
}

export function About() {
  const reduced = useReducedMotion();

  return (
    <section className={APP_PAGE}>
      <TextAnimate
        as="h2"
        by="word"
        animation="blurInUp"
        startOnView={false}
        once
        className="font-serif text-4xl tracking-tight sm:text-5xl"
      >
        {headingForApp("about")}
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {profile.availabilityDetail} I build fullstack products for web and
          mobile.
        </p>
      </Stagger>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:gap-14">
        <div className="min-w-0 max-w-2xl">
          <Stagger delay={STAGGER * 2}>
            <p className="text-base leading-relaxed text-fg/90">
              {profile.manifesto} First Class BEng Software Engineering, IIT /
              University of Westminster, {profile.graduation}.
            </p>
          </Stagger>

          <Stagger delay={STAGGER * 3}>
            <section className="mt-10">
              <Label>
                <Notebook className="size-3" strokeWidth={1.75} />
                notes
              </Label>
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
                <Link href={hrefForApp("contact")} className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" strokeWidth={1.75} />
                  write
                </Link>
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
              <Fact icon={CircleDot} label="available" value={profile.availability} />
              {degree ? (
                <div>
                  <dt>
                    <Label>
                      <GraduationCap className="size-3" strokeWidth={1.75} />
                      school
                    </Label>
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href={hrefForApp("experience")}
                      className="text-[13px] text-muted transition-colors hover:text-accent"
                    >
                      {degree.title}
                    </Link>
                    <p className="mt-1 text-[12px] leading-relaxed text-dim">
                      IIT / University of Westminster
                      {degree.award ? ` · ${degree.award}` : ""}
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                      {degree.links?.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase transition-colors hover:text-accent"
                        >
                          {link.label}
                        </a>
                      ))}
                    </p>
                  </dd>
                </div>
              ) : null}
              <Fact icon={Calendar} label="graduated" value={profile.graduation} />
            </dl>
          </Stagger>

          <section>
            <Stagger delay={STAGGER * 4}>
              <Label>
                <MapPin className="size-3" strokeWidth={1.75} />
                based
              </Label>
            </Stagger>
            <div className="relative mt-3 overflow-hidden rounded-2xl border border-line bg-surface dark:bg-background">
              <div className="h-48 w-full text-fg/40 dark:text-fg/20 sm:h-56 mask-[radial-gradient(ellipse_at_center,black_42%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_78%)]">
                <AboutMap pulse={!reduced} />
              </div>
              <Stagger delay={STAGGER * 4}>
                <p className="absolute right-4 bottom-3 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {profile.location}
                </p>
              </Stagger>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CircleDot;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt>
        <Label>
          <Icon className="size-3" strokeWidth={1.75} />
          {label}
        </Label>
      </dt>
      <dd className="mt-1 text-[13px] text-muted">{value}</dd>
    </div>
  );
}
