"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { AppWindow, CloudCog, Code, Server, Smartphone, type LucideIcon } from "lucide-react";
import { stackIconSlugs, stackLayers } from "@/content/stack";
import { headingForApp, APP_PAGE } from "@/lib/apps";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { Badge } from "@/components/ui/badge";
import { IconCloud } from "@/components/ui/icon-cloud";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TextAnimate } from "@/components/ui/text-animate";

const packageCount = stackLayers.reduce(
  (total, layer) => total + layer.packages.length,
  0,
);

const LAYER_ICONS: Record<string, LucideIcon> = {
  languages: Code,
  frontend: AppWindow,
  backend: Server,
  mobile: Smartphone,
  ops: CloudCog,
};

function Layer({
  label,
  icon: Icon,
  count,
  children,
}: {
  label: string;
  icon: LucideIcon;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline">
      <div className="flex items-baseline gap-2 sm:flex-col sm:gap-1">
        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
          <Icon className="size-3" strokeWidth={1.75} />
          {label}
        </p>
        <p className="font-mono text-[10px] tracking-[0.14em] text-flare sm:pl-4.5">
          {String(count).padStart(2, "0")}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Stack() {
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [iconHexes, setIconHexes] = useState({
    accent: "c8f542",
    flare: "ff7a4a",
  });

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim().replace("#", "");
    const flare = styles.getPropertyValue("--flare").trim().replace("#", "");
    if (accent && flare) setIconHexes({ accent, flare });
  }, [resolvedTheme]);

  const stackImages = useMemo(
    () =>
      stackIconSlugs.map(
        (slug, index) =>
          `https://cdn.simpleicons.org/${slug}/${index % 2 === 0 ? iconHexes.accent : iconHexes.flare}`,
      ),
    [iconHexes],
  );
  const showCloud = !reduced;

  return (
    <section className={APP_PAGE}>
      <header>
        <div className="flex items-end justify-between gap-6">
          <TextAnimate
            as="h2"
            by="word"
            animation="blurInUp"
            startOnView={false}
            once
            className="font-serif text-4xl tracking-tight sm:text-5xl"
          >
            {headingForApp("stack")}
          </TextAnimate>
          <Stagger delay={STAGGER} className="hidden shrink-0 text-right md:block">
            <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
              <NumberTicker
                value={packageCount}
                className="font-mono text-[11px] tracking-[0.22em] text-muted"
              />{" "}
              packages
            </p>
          </Stagger>
        </div>
        <Stagger delay={STAGGER}>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            What I build with: web, mobile, and backend.
          </p>
        </Stagger>
        <Stagger delay={STAGGER}>
          <p className="mt-3 font-mono text-[11px] tracking-[0.22em] text-muted uppercase md:hidden">
            <NumberTicker
              value={packageCount}
              className="font-mono text-[11px] tracking-[0.22em] text-muted"
            />{" "}
            packages
          </p>
        </Stagger>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-12">
        <Stagger delay={STAGGER * 2}>
          <ul className="divide-y divide-line border-y border-line">
            {stackLayers.map((layer) => (
              <li key={layer.id}>
                <Layer
                  label={layer.label}
                  icon={LAYER_ICONS[layer.id]}
                  count={layer.packages.length}
                >
                  {layer.packages.map((name) => (
                    <Badge
                      key={name}
                      variant="outline"
                      className="border-line font-mono text-[11px] tracking-[0.04em] text-fg"
                    >
                      {name}
                    </Badge>
                  ))}
                </Layer>
              </li>
            ))}
          </ul>
        </Stagger>

        {showCloud ? (
          <Stagger
            delay={STAGGER * 2}
            blur={false}
            className="mx-auto w-full max-w-[min(100%,18rem)] lg:sticky lg:top-4 lg:mx-0 lg:max-w-88 lg:justify-self-end"
          >
            <div
              aria-hidden
              className="aspect-square w-full mask-[radial-gradient(circle,black_42%,transparent_74%)] [-webkit-mask-image:radial-gradient(circle,black_42%,transparent_74%)]"
            >
              <IconCloud images={[...stackImages]} showControl={false} />
            </div>
          </Stagger>
        ) : null}
      </div>
    </section>
  );
}
