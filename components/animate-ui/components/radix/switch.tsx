'use client';

import * as React from 'react';

import {
  Switch as SwitchPrimitive,
  SwitchThumb as SwitchThumbPrimitive,
  SwitchIcon as SwitchIconPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/switch';
import { cn } from '@/lib/utils';

type SwitchProps = SwitchPrimitiveProps & {
  pressedWidth?: number;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  thumbIcon?: React.ReactElement;
};

function Switch({
  className,
  pressedWidth = 22,
  startIcon,
  endIcon,
  thumbIcon,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive
      className={cn(
        'relative peer flex h-7 w-11 shrink-0 cursor-pointer items-center justify-start rounded-full border border-line px-0.5 outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-45',
        'data-[state=checked]:justify-end data-[state=checked]:bg-accent data-[state=unchecked]:bg-wash',
        className,
      )}
      {...props}
    >
      <SwitchThumbPrimitive
        className={cn(
          'pointer-events-none relative z-10 block size-5 rounded-full bg-surface ring-0',
        )}
        pressedAnimation={{ width: pressedWidth }}
      >
        {thumbIcon && (
          <SwitchIconPrimitive
            position="thumb"
            className="absolute [&_svg]:size-2.25 left-1/2 top-1/2 -translate-1/2 dark:text-neutral-500 text-neutral-400"
          >
            {thumbIcon}
          </SwitchIconPrimitive>
        )}
      </SwitchThumbPrimitive>

      {startIcon && (
        <SwitchIconPrimitive
          position="left"
          className="absolute [&_svg]:size-2.25 left-0.5 top-1/2 -translate-y-1/2 dark:text-neutral-500 text-neutral-400"
        >
          {startIcon}
        </SwitchIconPrimitive>
      )}
      {endIcon && (
        <SwitchIconPrimitive
          position="right"
          className="absolute [&_svg]:size-2.25 right-0.5 top-1/2 -translate-y-1/2 dark:text-neutral-400 text-neutral-500"
        >
          {endIcon}
        </SwitchIconPrimitive>
      )}
    </SwitchPrimitive>
  );
}

export { Switch, type SwitchProps };
