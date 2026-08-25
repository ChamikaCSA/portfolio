"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import type { ProjectShot } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ShotFrame({
  shot,
  index,
  className,
  compact = false,
}: {
  shot: ProjectShot;
  index?: number;
  className?: string;
  compact?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(shot.src) && !broken;
  const mobile = shot.frame === "mobile";
  const label =
    typeof index === "number"
      ? `shot / ${String(index + 1).padStart(2, "0")}`
      : "shot";

  return (
    <figure className={cn("min-w-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed border-line bg-wash",
          mobile && !compact
            ? "mx-auto aspect-9/16 max-w-56"
            : "aspect-16/10",
          compact &&
            "max-w-none rounded-none border-0 border-b border-solid border-line",
        )}
      >
        {showImage ? (
          <Image
            src={shot.src!}
            alt={shot.caption}
            fill
            className="object-cover"
            sizes={compact ? "24rem" : "(min-width: 1024px) 40rem, 100vw"}
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <Camera
              className="size-5 text-dim"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
              {label}
            </p>
            {compact ? null : (
              <p className="max-w-[16rem] text-[11px] leading-snug text-muted">
                {shot.caption}
              </p>
            )}
          </div>
        )}
      </div>
      {compact ? null : (
        <figcaption className="mt-2 font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
          {shot.caption}
        </figcaption>
      )}
    </figure>
  );
}
