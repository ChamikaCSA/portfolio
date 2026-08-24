import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
} from "react";

import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 72,
  ...props
}) => {
  return (
    <span className={cn("relative inline-block", className)} {...props}>
      <span>{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-shiny-text bg-linear-to-r from-transparent via-fg to-transparent bg-clip-text bg-no-repeat text-transparent [-webkit-text-fill-color:transparent] bg-size-[var(--shiny-width)_100%] motion-reduce:hidden"
        style={
          {
            "--shiny-width": `${shimmerWidth}px`,
          } as CSSProperties
        }
      >
        {children}
      </span>
    </span>
  );
};
