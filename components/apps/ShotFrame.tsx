"use client";

import { useId, useRef, useState } from "react";
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
  const [failedSrc, setFailedSrc] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const showImage = Boolean(shot.src) && failedSrc !== shot.src;
  const mobile = shot.frame === "mobile";
  const label = typeof index === "number" ? `shot / ${String(index + 1).padStart(2, "0")}` : "shot";
  const preview = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-wash",
        !showImage && "border-dashed",
        !mobile && "aspect-16/10",
        compact && "rounded-none border-0 border-solid border-line",
        compact && (mobile ? "border-r" : "border-b"),
      )}
      style={mobile ? { aspectRatio: `${shot.width ?? 9} / ${shot.height ?? 16}` } : undefined}
    >
      {showImage ? (
        <Image
          src={shot.src!}
          alt={shot.caption}
          fill
          unoptimized
          className="object-contain"
          sizes={compact ? "24rem" : "(min-width: 1024px) 40rem, 100vw"}
          onError={() => setFailedSrc(shot.src)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <Camera className="size-5 text-dim" strokeWidth={1.5} aria-hidden />
          <p className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">{label}</p>
          {compact ? null : <p className="max-w-[16rem] text-[11px] leading-snug text-muted">{shot.caption}</p>}
        </div>
      )}

    </div>
  );

  return (
    <figure className={cn("min-w-0", className)}>
      {showImage && !compact ? (
        <button
          type="button"
          className="block w-full cursor-pointer rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label={`View full-size screenshot: ${shot.caption}`}
          onClick={() => dialog.current?.showModal()}
        >
          {preview}
        </button>
      ) : preview}
      {!compact ? (
        <figcaption className={cn("mt-3 flex gap-2 font-mono text-[10px] tracking-[0.12em] text-muted uppercase", mobile ? "flex-col items-start" : "flex-wrap items-center justify-between")}>
          <span>{shot.caption}</span>
          {shot.sampleData ? <span className="text-dim">Sample data</span> : null}
        </figcaption>
      ) : null}
      {showImage && !compact ? (
        <dialog
          ref={dialog}
          aria-labelledby={titleId}
          onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
          className={cn(
            "fixed inset-0 m-auto max-h-[92dvh] w-[94vw] overflow-hidden rounded-xl border border-line bg-background p-0 text-fg shadow-2xl backdrop:bg-black/50",
            mobile ? "max-w-sm" : "max-w-[1600px]",
          )}
        >
          <div className="grid h-11 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center border-b border-line">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close screenshot"
              className="group flex size-11 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <span className="relative size-3 rounded-full bg-[#ed6a5e] shadow-[inset_0_0_0_0.5px_#e24b41]">
                <svg viewBox="0 0 12 12" fill="none" aria-hidden className="absolute inset-0 size-3 text-[#4d0000] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <path d="M3.25 3.25 8.75 8.75M8.75 3.25 3.25 8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <h3 id={titleId} className="truncate text-center font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{shot.caption}</h3>
          </div>
          <div className="flex justify-center bg-wash">
            <Image
              src={shot.src!}
              alt={shot.caption}
              width={shot.width ?? 3200}
              height={shot.height ?? 2000}
              unoptimized
              className="block h-auto max-h-[calc(92dvh-2.75rem-2px)] w-auto max-w-full object-contain"
            />
          </div>
        </dialog>
      ) : null}
    </figure>
  );
}
