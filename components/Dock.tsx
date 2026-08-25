"use client";

import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "motion/react";
import { cn } from "@/lib/utils";

export type DockItemData = {
  icon: ReactNode;
  label: ReactNode;
  onClick: () => void;
  className?: string;
  separator?: boolean;
  ariaLabel?: string;
  active?: boolean;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  ariaLabel?: string;
  active?: boolean;
};

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  ariaLabel,
  active,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex shrink-0 origin-bottom items-center justify-center overflow-visible rounded-[22%] bg-wash shadow-[0_8px_24px_rgb(0_0_0/0.12)] dark:shadow-[0_8px_24px_rgb(0_0_0/0.4)]",
        className,
      )}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
    >
      {Children.map(children, (child) =>
        isValidHoveredChild(child)
          ? cloneElement(child, { isHovered })
          : child,
      )}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full transition-opacity duration-200",
          active
            ? "bg-accent opacity-100 shadow-[0_0_8px_var(--accent),0_0_14px_var(--flare)]"
            : "opacity-0",
        )}
        style={{ top: "calc(100% + 3px)" }}
      />
    </motion.div>
  );
}

function isValidHoveredChild(
  child: ReactNode,
): child is ReactElement<{ isHovered?: MotionValue<number> }> {
  return Boolean(child) && typeof child === "object" && "type" in (child as object);
}

type DockLabelProps = {
  className?: string;
  children: ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute -top-6 left-1/2 w-fit whitespace-pre rounded-sm border border-line bg-surface px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] text-fg/90 uppercase shadow-[0_8px_24px_rgb(0_0_0/0.12)] dark:shadow-[0_8px_24px_rgb(0_0_0/0.4)]",
            className,
          )}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight,
  dockHeight,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const pad = 12;
  const frame = 2;
  const restHeight = panelHeight ?? baseItemSize + pad * 2 + frame;

  const maxHeight = useMemo(
    () =>
      Math.max(
        dockHeight ?? restHeight,
        magnification + pad * 2 + frame,
      ),
    [dockHeight, magnification, restHeight, pad],
  );
  const heightRow = useTransform(isHovered, [0, 1], [restHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full transform-none! items-center"
    >
      <div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          "absolute bottom-2 inset-x-0 mx-auto flex w-max items-end gap-3 overflow-visible rounded-2xl border border-line p-3 box-content",
          className,
        )}
        style={{ height: baseItemSize }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <FragmentItem
            key={index}
            item={item}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          />
        ))}
      </div>
    </motion.div>
  );
}

function FragmentItem({
  item,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: {
  item: DockItemData;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  magnification: number;
  baseItemSize: number;
}) {
  return (
    <>
      {item.separator ? (
        <span
          aria-hidden
          className="mx-0.5 hidden w-px shrink-0 self-end bg-fg/20 sm:block"
          style={{ height: baseItemSize }}
        />
      ) : null}
      <DockItem
        onClick={item.onClick}
        className={item.className}
        mouseX={mouseX}
        spring={spring}
        distance={distance}
        magnification={magnification}
        baseItemSize={baseItemSize}
        ariaLabel={item.ariaLabel}
        active={item.active}
      >
        <DockIcon>{item.icon}</DockIcon>
        <DockLabel>{item.label}</DockLabel>
      </DockItem>
    </>
  );
}

export { Dock };
