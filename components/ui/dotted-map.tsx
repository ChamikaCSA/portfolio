"use client";

import * as React from "react";
import { startTransition } from "react";
import { createMap } from "svg-dotted-map";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { DottedMapSkeleton } from "@/components/ui/dotted-map-skeleton";

export interface Marker {
  lat: number;
  lng: number;
  size?: number;
  pulse?: boolean;
}

/** addMarkers returns markers with lat/lng removed; only x, y and other props (e.g. size) remain */
type MapMarker<M extends Marker> = Omit<M, "lat" | "lng"> & {
  x: number;
  y: number;
};

type MapGeometry<M extends Marker = Marker> = {
  points: { x: number; y: number }[];
  markers: MapMarker<M>[];
  xStep: number;
  yToRowIndex: Map<number, number>;
};

function afterIdle(callback: () => void, timeout = 800) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 32);
  return () => window.clearTimeout(id);
}

function buildGeometry<M extends Marker>(
  width: number,
  height: number,
  mapSamples: number,
  markers: M[],
): MapGeometry<M> {
  const { points, addMarkers } = createMap({ width, height, mapSamples });
  const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
  const rowMap = new Map<number, number>();
  let step = 0;
  let prevY = Number.NaN;
  let prevXInRow = Number.NaN;

  for (const point of sorted) {
    if (point.y !== prevY) {
      prevY = point.y;
      prevXInRow = Number.NaN;
      if (!rowMap.has(point.y)) rowMap.set(point.y, rowMap.size);
    }
    if (!Number.isNaN(prevXInRow)) {
      const delta = point.x - prevXInRow;
      if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
    }
    prevXInRow = point.x;
  }

  return {
    points,
    markers: addMarkers(markers),
    xStep: step || 1,
    yToRowIndex: rowMap,
  };
}

export interface DottedMapProps<M extends Marker = Marker>
  extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: M[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  stagger?: boolean;
  pulse?: boolean;

  renderMarkerOverlay?: (args: {
    marker: MapMarker<M>;
    index: number;
    x: number;
    y: number;
    r: number;
  }) => React.ReactNode;
}

const EMPTY_MARKERS: Marker[] = [];

export function DottedMap<M extends Marker = Marker>({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = EMPTY_MARKERS as M[],
  dotColor = "currentColor",
  markerColor = "#FF6900",
  dotRadius = 0.2,
  stagger = true,
  pulse = false,
  renderMarkerOverlay,
  className,
  style,
  ...svgProps
}: DottedMapProps<M>) {
  const reduced = useReducedMotion();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = React.useState<MapGeometry<M> | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelIdle = () => {};
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        cancelIdle = afterIdle(() => {
          const next = buildGeometry(width, height, mapSamples, markers);
          startTransition(() => setGeometry(next));
        });
      },
      { rootMargin: "240px" },
    );

    observer.observe(host);
    return () => {
      observer.disconnect();
      cancelIdle();
    };
  }, [width, height, mapSamples, markers]);

  const processedMarkers = geometry?.markers ?? [];
  const points = geometry?.points ?? [];
  const xStep = geometry?.xStep ?? 1;
  const yToRowIndex = geometry?.yToRowIndex ?? new Map<number, number>();

  return (
    <div ref={hostRef} className="relative h-full w-full">
      {geometry ? (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={cn(
            className,
            !reduced && "duration-500 animate-in fade-in",
          )}
          style={{ width: "100%", height: "100%", ...style }}
          {...svgProps}
        >
          {points.map((point, index) => {
            const rowIndex = yToRowIndex.get(point.y) ?? 0;
            const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
            return (
              <circle
                cx={point.x + offsetX}
                cy={point.y}
                r={dotRadius}
                fill={dotColor}
                key={`${point.x}-${point.y}-${index}`}
              />
            );
          })}

          {processedMarkers.map((marker, index) => {
            const rowIndex = yToRowIndex.get(marker.y) ?? 0;
            const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;

            const x = marker.x + offsetX;
            const y = marker.y;
            const r = marker.size ?? dotRadius;
            const shouldPulse = pulse
              ? marker.pulse !== false
              : marker.pulse === true;
            const pulseTo = r * 2.8;

            return (
              <g key={`${marker.x}-${marker.y}-${index}`}>
                <circle cx={x} cy={y} r={r} fill={markerColor} />

                {shouldPulse ? (
                  <g pointerEvents="none">
                    <circle
                      cx={x}
                      cy={y}
                      r={r}
                      fill="none"
                      stroke={markerColor}
                      strokeOpacity={1}
                      strokeWidth={0.35}
                    >
                      <animate
                        attributeName="r"
                        values={`${r};${pulseTo}`}
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx={x}
                      cy={y}
                      r={r}
                      fill="none"
                      stroke={markerColor}
                      strokeOpacity={0.9}
                      strokeWidth={0.3}
                    >
                      <animate
                        attributeName="r"
                        values={`${r};${pulseTo}`}
                        dur="1.4s"
                        begin="0.7s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.9;0"
                        dur="1.4s"
                        begin="0.7s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ) : null}

                {renderMarkerOverlay?.({
                  marker: { ...marker, x, y },
                  index,
                  x,
                  y,
                  r,
                })}
              </g>
            );
          })}
        </svg>
      ) : (
        <DottedMapSkeleton />
      )}
    </div>
  );
}
