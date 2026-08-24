'use client';

import * as React from 'react';

import {
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuContent as DropdownMenuContentPrimitive,
  DropdownMenuGroup as DropdownMenuGroupPrimitive,
  DropdownMenuHighlightItem as DropdownMenuHighlightItemPrimitive,
  DropdownMenuHighlight as DropdownMenuHighlightPrimitive,
  DropdownMenuItem as DropdownMenuItemPrimitive,
  DropdownMenuItemIndicator as DropdownMenuItemIndicatorPrimitive,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItemPrimitive,
  DropdownMenuRadioGroup as DropdownMenuRadioGroupPrimitive,
  DropdownMenuRadioItem as DropdownMenuRadioItemPrimitive,
  DropdownMenuLabel as DropdownMenuLabelPrimitive,
  DropdownMenuSeparator as DropdownMenuSeparatorPrimitive,
  DropdownMenuShortcut as DropdownMenuShortcutPrimitive,
  DropdownMenuSub as DropdownMenuSubPrimitive,
  DropdownMenuSubContent as DropdownMenuSubContentPrimitive,
  DropdownMenuSubTrigger as DropdownMenuSubTriggerPrimitive,
  DropdownMenuTrigger as DropdownMenuTriggerPrimitive,
  type DropdownMenuProps as DropdownMenuPrimitiveProps,
  type DropdownMenuContentProps as DropdownMenuContentPrimitiveProps,
  type DropdownMenuGroupProps as DropdownMenuGroupPrimitiveProps,
  type DropdownMenuItemProps as DropdownMenuItemPrimitiveProps,
  type DropdownMenuCheckboxItemProps as DropdownMenuCheckboxItemPrimitiveProps,
  type DropdownMenuRadioGroupProps as DropdownMenuRadioGroupPrimitiveProps,
  type DropdownMenuRadioItemProps as DropdownMenuRadioItemPrimitiveProps,
  type DropdownMenuLabelProps as DropdownMenuLabelPrimitiveProps,
  type DropdownMenuSeparatorProps as DropdownMenuSeparatorPrimitiveProps,
  type DropdownMenuShortcutProps as DropdownMenuShortcutPrimitiveProps,
  type DropdownMenuSubProps as DropdownMenuSubPrimitiveProps,
  type DropdownMenuSubContentProps as DropdownMenuSubContentPrimitiveProps,
  type DropdownMenuSubTriggerProps as DropdownMenuSubTriggerPrimitiveProps,
  type DropdownMenuTriggerProps as DropdownMenuTriggerPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

type DropdownMenuProps = DropdownMenuPrimitiveProps;

function DropdownMenu(props: DropdownMenuProps) {
  return <DropdownMenuPrimitive {...props} />;
}

type DropdownMenuTriggerProps = DropdownMenuTriggerPrimitiveProps;

function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <DropdownMenuTriggerPrimitive {...props} />;
}

const menuPanel =
  "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-52 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-line glass p-1 text-fg shadow-[0_18px_50px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.12)] outline-none dark:shadow-[0_18px_50px_rgb(0_0_0/0.55),inset_0_1px_0_rgb(255_255_255/0.08)]";

const menuItem =
  "relative z-[1] flex min-h-8 cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[highlighted]:text-fg data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";

const menuKbd =
  'ml-auto inline-flex min-w-5 items-center justify-center rounded-sm border border-line bg-wash/80 px-1 py-px font-mono text-[9px] tracking-[0.14em] text-dim uppercase';

type DropdownMenuContentProps = DropdownMenuContentPrimitiveProps;

function DropdownMenuContent({
  sideOffset = 6,
  collisionPadding = 8,
  className,
  children,
  ...props
}: DropdownMenuContentProps) {
  const reduced = useReducedMotion();

  return (
    <DropdownMenuContentPrimitive
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      loop
      className={cn(menuPanel, className)}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
      }
      {...props}
    >
      <DropdownMenuHighlightPrimitive
        mode="parent"
        className="rounded-xl bg-fg/[0.07] dark:bg-fg/8"
      >
        {children}
      </DropdownMenuHighlightPrimitive>
    </DropdownMenuContentPrimitive>
  );
}

type DropdownMenuGroupProps = DropdownMenuGroupPrimitiveProps;

function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return <DropdownMenuGroupPrimitive {...props} />;
}

type DropdownMenuItemProps = DropdownMenuItemPrimitiveProps & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
};

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  disabled,
  ...props
}: DropdownMenuItemProps) {
  const id = React.useId();

  return (
    <DropdownMenuHighlightItemPrimitive
      value={id}
      activeClassName={
        variant === 'destructive'
          ? 'bg-destructive/10 dark:bg-destructive/20'
          : ''
      }
      disabled={disabled}
    >
      <DropdownMenuItemPrimitive
        disabled={disabled}
        data-value={id}
        data-inset={inset}
        data-variant={variant}
        className={cn(menuItem, className)}
        {...props}
      />
    </DropdownMenuHighlightItemPrimitive>
  );
}

type DropdownMenuCheckboxItemProps = DropdownMenuCheckboxItemPrimitiveProps;

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  disabled,
  ...props
}: DropdownMenuCheckboxItemProps) {
  const id = React.useId();

  return (
    <DropdownMenuHighlightItemPrimitive value={id} disabled={disabled}>
      <DropdownMenuCheckboxItemPrimitive
        disabled={disabled}
        data-value={id}
        className={cn(menuItem, 'pr-2 pl-8', className)}
        checked={checked}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuItemIndicatorPrimitive
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckIcon className="size-4" />
          </DropdownMenuItemIndicatorPrimitive>
        </span>
        {children}
      </DropdownMenuCheckboxItemPrimitive>
    </DropdownMenuHighlightItemPrimitive>
  );
}

type DropdownMenuRadioGroupProps = DropdownMenuRadioGroupPrimitiveProps;

function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <DropdownMenuRadioGroupPrimitive {...props} />;
}

type DropdownMenuRadioItemProps = DropdownMenuRadioItemPrimitiveProps;

function DropdownMenuRadioItem({
  className,
  children,
  disabled,
  ...props
}: DropdownMenuRadioItemProps) {
  const id = React.useId();

  return (
    <DropdownMenuHighlightItemPrimitive value={id} disabled={disabled}>
      <DropdownMenuRadioItemPrimitive
        disabled={disabled}
        data-value={id}
        className={cn(menuItem, 'pr-2 pl-8', className)}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuItemIndicatorPrimitive layoutId="dropdown-menu-item-indicator-radio">
            <CircleIcon className="size-2 fill-current" />
          </DropdownMenuItemIndicatorPrimitive>
        </span>
        {children}
      </DropdownMenuRadioItemPrimitive>
    </DropdownMenuHighlightItemPrimitive>
  );
}

type DropdownMenuLabelProps = DropdownMenuLabelPrimitiveProps & {
  inset?: boolean;
};

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuLabelPrimitive
      data-inset={inset}
      className={cn(
        'px-2.5 py-1.5 font-mono text-[10px] tracking-[0.22em] text-dim uppercase data-inset:pl-8',
        className,
      )}
      {...props}
    />
  );
}

type DropdownMenuSeparatorProps = DropdownMenuSeparatorPrimitiveProps;

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuSeparatorPrimitive
      className={cn('bg-line -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

type DropdownMenuShortcutProps = DropdownMenuShortcutPrimitiveProps;

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <DropdownMenuShortcutPrimitive
      className={cn(menuKbd, className)}
      {...props}
    />
  );
}

type DropdownMenuSubProps = DropdownMenuSubPrimitiveProps;

function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <DropdownMenuSubPrimitive {...props} />;
}

type DropdownMenuSubTriggerProps = DropdownMenuSubTriggerPrimitiveProps & {
  inset?: boolean;
};

function DropdownMenuSubTrigger({
  disabled,
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  const id = React.useId();

  return (
    <DropdownMenuHighlightItemPrimitive value={id} disabled={disabled}>
      <DropdownMenuSubTriggerPrimitive
        disabled={disabled}
        data-value={id}
        data-inset={inset}
        className={cn(
          menuItem,
          'data-[state=open]:text-fg',
          'data-[state=open]:**:data-[slot=chevron]:rotate-90 **:data-[slot=chevron]:transition-transform **:data-[slot=chevron]:duration-200 **:data-[slot=chevron]:ease-out',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRightIcon data-slot="chevron" className="ml-auto size-3.5 text-dim" />
      </DropdownMenuSubTriggerPrimitive>
    </DropdownMenuHighlightItemPrimitive>
  );
}

type DropdownMenuSubContentProps = DropdownMenuSubContentPrimitiveProps;

function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps) {
  const reduced = useReducedMotion();

  return (
    <DropdownMenuSubContentPrimitive
      className={cn(menuPanel, className)}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
      }
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuContentProps,
  type DropdownMenuGroupProps,
  type DropdownMenuItemProps,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuRadioGroupProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuShortcutProps,
  type DropdownMenuSubProps,
  type DropdownMenuSubTriggerProps,
  type DropdownMenuSubContentProps,
};
