"use client";

import { useRef, type ReactNode } from "react";
import { ArrowUpRight, Briefcase, GraduationCap } from "lucide-react";
import { experience, type ExperienceEntry } from "@/content/experience";
import { gsap, useGSAP } from "@/lib/gsap";
import { APP_SCROLL_ID, headingForApp, APP_PAGE } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import BorderGlow from "@/components/BorderGlow";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { Badge } from "@/components/ui/badge";
import { TextAnimate } from "@/components/ui/text-animate";

const GLOW_UP_S = 0.9;

function resolveScroller(root: HTMLElement) {
  const nested = root.closest(`#${APP_SCROLL_ID}`);
  if (nested instanceof HTMLElement) return nested;
  return document.getElementById(APP_SCROLL_ID) ?? window;
}

function scrollAmount(scroller: HTMLElement | Window) {
  if (scroller instanceof Window) {
    const max =
      document.documentElement.scrollHeight - scroller.innerHeight;
    return max <= 0 ? 0 : scroller.scrollY / max;
  }
  const max = scroller.scrollHeight - scroller.clientHeight;
  return max <= 0 ? 0 : scroller.scrollTop / max;
}

function Timeline({
  reduced,
  children,
}: {
  reduced: boolean;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const ignite = useRef({ value: reduced ? 1 : 0 });

  useGSAP(
    () => {
      const root = rootRef.current;
      const glow = glowRef.current;
      const rail = railRef.current;
      if (!root || !glow || !rail) return;

      const paint = () => {
        const nodes =
          root.querySelectorAll<HTMLElement>("[data-timeline-node]");
        if (nodes.length === 0) return;

        const rootBox = root.getBoundingClientRect();
        let firstMid = Infinity;
        let lastMid = -Infinity;
        nodes.forEach((node) => {
          const box = node.getBoundingClientRect();
          const mid = box.top + box.height / 2;
          if (mid < firstMid) firstMid = mid;
          if (mid > lastMid) lastMid = mid;
        });
        const span = Math.max(lastMid - firstMid, 1);

        rail.style.top = `${firstMid - rootBox.top}px`;
        rail.style.height = `${span}px`;

        const stops = Array.from(nodes, (node) => {
          const box = node.getBoundingClientRect();
          const t = ((box.top + box.height / 2 - firstMid) / span) * 100;
          const color =
            node.dataset.kind === "education"
              ? "var(--flare)"
              : "var(--accent)";
          return `${color} ${t.toFixed(2)}%`;
        });
        glow.style.backgroundImage = `linear-gradient(to bottom, ${stops.join(", ")})`;

        if (reduced) {
          glow.style.clipPath = "inset(0 0 0 0)";
          nodes.forEach((node) => {
            node.style.opacity = "1";
          });
          return;
        }

        const amount = ignite.current.value;
        const scroll = Math.max(
          0,
          Math.min(1, scrollAmount(resolveScroller(root))),
        );
        const progress = 1 - amount * (1 - scroll);
        const fade = 0.08;

        glow.style.clipPath = `inset(${progress * 100}% 0 0 0)`;
        nodes.forEach((node) => {
          const box = node.getBoundingClientRect();
          const t = (box.top + box.height / 2 - firstMid) / span;
          node.style.opacity = String(
            Math.max(0, Math.min(1, (t - progress) / fade + 1)),
          );
        });
      };

      paint();

      const resize = new ResizeObserver(paint);
      resize.observe(root);

      const scroller = resolveScroller(root);
      if (scroller instanceof HTMLElement) resize.observe(scroller);

      scroller.addEventListener("scroll", paint, { passive: true });

      if (reduced) {
        return () => {
          scroller.removeEventListener("scroll", paint);
          resize.disconnect();
        };
      }

      const tween = gsap.to(ignite.current, {
        value: 1,
        duration: GLOW_UP_S,
        ease: "power3.out",
        overwrite: true,
        onUpdate: paint,
      });

      const tick = () => paint();
      gsap.ticker.add(tick);
      tween.eventCallback("onComplete", () => gsap.ticker.remove(tick));

      return () => {
        gsap.ticker.remove(tick);
        tween.kill();
        scroller.removeEventListener("scroll", paint);
        resize.disconnect();
      };
    },
    { dependencies: [reduced] },
  );

  return (
    <div ref={rootRef} className="relative mt-10">
      <div
        ref={railRef}
        aria-hidden
        className="pointer-events-none absolute left-2 z-0 w-px sm:left-37"
      >
        <span className="absolute inset-0 bg-line" />
        <span
          ref={glowRef}
          className="absolute inset-0 shadow-[0_0_12px_var(--accent),0_0_16px_var(--flare)]"
          style={{ clipPath: reduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function KindBadge({ kind }: { kind: ExperienceEntry["kind"] }) {
  const Icon = kind === "education" ? GraduationCap : Briefcase;
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-line font-mono text-[10px] tracking-[0.14em] uppercase",
        kind === "education" ? "text-flare" : "text-accent",
      )}
    >
      <Icon strokeWidth={1.75} />
      {kind}
    </Badge>
  );
}

function railLabel(entry: ExperienceEntry) {
  const start = entry.timestamp.slice(0, 4);
  if (/present/i.test(entry.range)) return `${start} — present`;
  const years = [...entry.range.matchAll(/\d{4}/g)].map((match) => match[0]);
  const last = years.at(-1);
  if (!last || last === start) return start;
  return `${start} — ${last}`;
}

function RailMark({ entry }: { entry: ExperienceEntry }) {
  return (
    <p className="whitespace-nowrap font-mono text-[11px] leading-none tabular-nums tracking-normal text-dim">
      {railLabel(entry)}
    </p>
  );
}

function ExperienceCard({
  entry,
  reduced,
}: {
  entry: ExperienceEntry;
  reduced: boolean;
}) {
  const numbered = entry.kind !== "education" && entry.bullets.length > 1;

  return (
    <article className="relative grid w-full grid-cols-[1rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[7.5rem_1rem_minmax(0,1fr)] sm:gap-x-5">
      <div className="hidden pt-6 text-right sm:block">
        <RailMark entry={entry} />
      </div>

      <div className="relative flex justify-center pt-6">
        <span className="relative size-2.5 shrink-0">
          <span className="absolute inset-0 rounded-full bg-line ring-4 ring-surface" />
          <span
            data-timeline-node
            data-kind={entry.kind}
            className={cn(
              "absolute inset-0 rounded-full opacity-0 ring-4 ring-surface",
              entry.kind === "education"
                ? "bg-flare shadow-[0_0_12px_var(--flare)]"
                : "bg-accent shadow-[0_0_12px_var(--accent)]",
            )}
          />
        </span>
      </div>

      <BorderGlow
        className="min-w-0 w-full"
        borderRadius={16}
        backgroundColor="var(--bg)"
        glowColor={entry.kind === "education" ? "var(--flare)" : "var(--accent)"}
        colors={["var(--accent)", "var(--flare)", "var(--fg)"]}
        fillOpacity={0}
        glowRadius={20}
        glowIntensity={0.85}
        interactive={!reduced}
      >
        <div className="p-5 sm:p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <KindBadge kind={entry.kind} />
            {entry.award ? (
              <Badge className="bg-flare font-mono text-[10px] tracking-[0.18em] text-flare-ink uppercase">
                {entry.award}
              </Badge>
            ) : null}
            <span className="font-mono text-[11px] tabular-nums tracking-normal text-dim sm:hidden">
              {railLabel(entry)}
            </span>
          </div>
          {entry.kicker ? (
            <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
              {entry.kicker}
            </p>
          ) : null}
          <h3 className="font-serif text-2xl tracking-tight sm:text-3xl">
            {entry.title}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {entry.org}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          {entry.links?.length ? (
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {entry.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          ) : null}
          {numbered ? (
            <ol className="mt-5 space-y-3">
              {entry.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3"
                >
                  <span
                    className={cn(
                      "font-mono text-[11px] tracking-[0.14em]",
                      index % 2 === 0 ? "text-accent" : "text-flare",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{bullet}</p>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="mt-5 space-y-2">
              {entry.bullets.map((bullet) => (
                <li key={bullet} className="text-sm leading-relaxed text-muted">
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      </BorderGlow>
    </article>
  );
}

export function Experience() {
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
        {headingForApp("experience")}
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Newest first.
        </p>
      </Stagger>

      <Timeline reduced={reduced}>
        <Stagger delay={STAGGER * 2}>
          <div className="space-y-5">
            {experience.map((entry) => (
              <div key={entry.id} className="space-y-3">
                <ExperienceCard entry={entry} reduced={reduced} />
                {entry.nested?.map((child) => (
                  <ExperienceCard
                    key={child.id}
                    entry={child}
                    reduced={reduced}
                  />
                ))}
              </div>
            ))}
          </div>
        </Stagger>
      </Timeline>
    </section>
  );
}
