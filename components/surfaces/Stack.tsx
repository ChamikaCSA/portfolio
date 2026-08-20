"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { stackIconSlugs, stackLayers } from "@/content/stack";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { Badge } from "@/components/ui/badge";
import { IconCloud } from "@/components/ui/icon-cloud";
import { Separator } from "@/components/ui/separator";
import { TextAnimate } from "@/components/ui/text-animate";

export function Stack() {
  const { resolvedTheme } = useTheme();
  const iconHex = resolvedTheme === "light" ? "141311" : "EBE6DC";
  const stackImages = useMemo(
    () =>
      stackIconSlugs.map(
        (slug) => `https://cdn.simpleicons.org/${slug}/${iconHex}`,
      ),
    [iconHex],
  );
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
        Stack
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          The tools I actually ship with — web, mobile, and the layer underneath.
        </p>
      </Stagger>

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,25rem)] lg:gap-10">
        <ul className="relative z-10 border-y border-line">
          {stackLayers.map((layer, index) => (
            <li key={layer.id}>
              <Stagger delay={STAGGER * (3 + index)}>
                {index > 0 ? <Separator className="bg-line" /> : null}
                <div className="grid gap-3 py-5 sm:grid-cols-[9rem_1fr] sm:items-baseline">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
                    {layer.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {layer.packages.map((pkg) => (
                      <Badge
                        key={pkg}
                        variant="outline"
                        className="border-line font-mono text-[11px] tracking-[0.04em] text-fg"
                      >
                        {pkg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Stagger>
            </li>
          ))}
        </ul>

        <Stagger
          delay={STAGGER * 2}
          blur={false}
          className="order-first flex justify-center lg:order-none lg:justify-end"
        >
          <div className="[mask-image:radial-gradient(circle,black_42%,transparent_74%)] [-webkit-mask-image:radial-gradient(circle,black_42%,transparent_74%)]">
            <IconCloud images={[...stackImages]} showControl={false} />
          </div>
        </Stagger>
      </div>
    </section>
  );
}
