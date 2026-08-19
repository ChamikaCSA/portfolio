import { cn } from "@/lib/utils";

export function DottedMapSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-full w-full animate-pulse bg-[radial-gradient(circle,currentColor_0.9px,transparent_1px)] bg-size-[7px_7px] opacity-55",
        className,
      )}
    />
  );
}
