'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import {
  Toggle as TogglePrimitive,
  ToggleItem as ToggleItemPrimitive,
  ToggleHighlight as ToggleHighlightPrimitive,
  type ToggleProps as TogglePrimitiveProps,
  type ToggleItemProps as ToggleItemPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/toggle';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] font-mono text-[10px] font-normal tracking-[0.14em] text-dim uppercase hover:text-fg disabled:pointer-events-none disabled:opacity-45 data-[state=on]:text-fg [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-0 transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'bg-transparent',
      },
      size: {
        default: 'h-9 px-2 min-w-9',
        sm: 'h-8 px-3 min-w-8',
        lg: 'h-10 px-2.5 min-w-10',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

type ToggleProps = TogglePrimitiveProps &
  ToggleItemPrimitiveProps &
  VariantProps<typeof toggleVariants>;

function Toggle({
  className,
  variant,
  size,
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      className="relative"
    >
      <ToggleHighlightPrimitive className="bg-wash rounded-[0.9rem]" />
      <ToggleItemPrimitive
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    </TogglePrimitive>
  );
}

export { Toggle, toggleVariants, type ToggleProps };
