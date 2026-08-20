"use client";

import { useRef, useState, type ReactNode } from "react";
import { log, type LogEntry } from "@/content/experience";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { APP_SCROLL_ID, SURFACE_PAGE } from "@/lib/surfaces";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { AnimatedList } from "@/components/ui/animated-list";
import { Badge } from "@/components/ui/badge";
import { TextAnimate } from "@/components/ui/text-animate";

gsap.registerPlugin(ScrollTrigger);

const GLOW_UP_S = 0.9;

function Timeline({
  reduced,
  armed,
  children,
}: {
  reduced: boolean;
  armed: boolean;
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
        const nodes = root.querySelectorAll<HTMLElement>("[data-timeline-node]");
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

        if (reduced) {
          glow.style.clipPath = "inset(0 0 0 0)";
          nodes.forEach((node) => {
            node.style.opacity = "1";
          });
          return;
        }

        const amount = ignite.current.value;
        if (amount <= 0) {
          glow.style.clipPath = "inset(100% 0 0 0)";
          nodes.forEach((node) => {
            node.style.opacity = "0";
          });
          return;
        }

        const scroller =
          document.getElementById(APP_SCROLL_ID) ?? window;
        const maxScroll = ScrollTrigger.maxScroll(scroller);
        const scrollY =
          scroller instanceof Window ? scroller.scrollY : scroller.scrollTop;
        const scroll =
          maxScroll <= 0
            ? 0
            : Math.max(0, Math.min(1, scrollY / maxScroll));
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

      const resize = new ResizeObserver(() => {
        ScrollTrigger.refresh();
        paint();
      });
      resize.observe(root);
      const mutate = new MutationObserver(paint);
      mutate.observe(root, { childList: true, subtree: true });

      if (reduced) {
        return () => {
          resize.disconnect();
          mutate.disconnect();
        };
      }

      ignite.current.value = armed ? ignite.current.value : 0;

      const tween = gsap.to(ignite.current, {
        value: armed ? 1 : 0,
        duration: armed ? GLOW_UP_S : 0,
        ease: "power3.out",
        overwrite: true,
        onUpdate: paint,
      });

      const scroller = document.getElementById(APP_SCROLL_ID) ?? window;

      const trigger = ScrollTrigger.create({
        scroller,
        start: 0,
        end: "max",
        onUpdate: paint,
        onRefresh: paint,
      });

      const tick = () => paint();
      if (!armed) {
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.add(tick);
        tween.eventCallback("onComplete", () => gsap.ticker.remove(tick));
      }

      return () => {
        gsap.ticker.remove(tick);
        tween.kill();
        trigger.kill();
        resize.disconnect();
        mutate.disconnect();
      };
    },
    { dependencies: [reduced, armed] },
  );

  return (
    <div ref={rootRef} className="relative mt-12">
      <div
        ref={railRef}
        aria-hidden
        className="pointer-events-none absolute left-2 z-0 w-px sm:left-37"
      >
        <span className="absolute inset-0 bg-line" />
        <span
          ref={glowRef}
          className="absolute inset-0 bg-accent shadow-[0_0_12px_var(--accent)]"
          style={{ clipPath: reduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function LogCard({ entry }: { entry: LogEntry }) {
  return (
    <article className="relative grid w-full grid-cols-[1rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[7.5rem_1rem_minmax(0,1fr)] sm:gap-x-5">
      <div className="hidden pt-5 text-right sm:block">
        <p className="font-mono text-[11px] tracking-[0.12em] text-dim">
          {entry.timestamp}
        </p>
        <Badge
          variant="outline"
          className="mt-2 border-line font-mono text-[10px] tracking-[0.14em] text-dim uppercase"
        >
          {entry.kind}
        </Badge>
      </div>

      <div className="relative flex justify-center">
        <span className="relative mt-[1.35rem] size-2.5 shrink-0">
          <span className="absolute inset-0 rounded-full bg-line ring-4 ring-bg" />
          <span
            data-timeline-node
            className="absolute inset-0 rounded-full bg-accent opacity-0 shadow-[0_0_12px_var(--accent)] ring-4 ring-bg"
          />
        </span>
      </div>

      <div className="pb-8 sm:pb-10">
        <div className="rounded-2xl border border-line glass p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:hidden">
            <p className="font-mono text-[11px] tracking-[0.12em] text-dim">
              {entry.timestamp}
            </p>
            <Badge
              variant="outline"
              className="border-line font-mono text-[10px] tracking-[0.14em] text-dim uppercase"
            >
              {entry.kind}
            </Badge>
          </div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted">
            {entry.range}
          </p>
          <h3 className="mt-1 font-serif text-2xl tracking-tight">{entry.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {entry.org}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          <ul className="mt-4 space-y-2">
            {entry.bullets.map((bullet) => (
              <li key={bullet} className="text-sm leading-relaxed text-muted">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function Log() {
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(reduced);
  const newestFirst = log;
  const oldestFirst = [...log].reverse();

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
        Process log
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Timestamped work and education. Quiet on purpose — the systems are in Work.
        </p>
      </Stagger>

      <Timeline reduced={reduced} armed={armed}>
        {reduced ? (
          <div>
            {newestFirst.map((entry) => (
              <LogCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <AnimatedList
            delay={STAGGER * 10 * 1000}
            className="w-full items-stretch gap-0"
            onComplete={() => setArmed(true)}
          >
            {oldestFirst.map((entry) => (
              <LogCard key={entry.id} entry={entry} />
            ))}
          </AnimatedList>
        )}
      </Timeline>
    </section>
  );
}
