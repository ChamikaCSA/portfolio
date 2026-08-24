'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

import {
  Dialog as DialogPrimitive,
  DialogContent as DialogContentPrimitive,
  DialogDescription as DialogDescriptionPrimitive,
  DialogFooter as DialogFooterPrimitive,
  DialogHeader as DialogHeaderPrimitive,
  DialogTitle as DialogTitlePrimitive,
  DialogTrigger as DialogTriggerPrimitive,
  DialogPortal as DialogPortalPrimitive,
  DialogOverlay as DialogOverlayPrimitive,
  DialogClose as DialogClosePrimitive,
  type DialogProps as DialogPrimitiveProps,
  type DialogContentProps as DialogContentPrimitiveProps,
  type DialogDescriptionProps as DialogDescriptionPrimitiveProps,
  type DialogFooterProps as DialogFooterPrimitiveProps,
  type DialogHeaderProps as DialogHeaderPrimitiveProps,
  type DialogTitleProps as DialogTitlePrimitiveProps,
  type DialogTriggerProps as DialogTriggerPrimitiveProps,
  type DialogOverlayProps as DialogOverlayPrimitiveProps,
  type DialogCloseProps as DialogClosePrimitiveProps,
} from '@/components/animate-ui/primitives/radix/dialog';
import { cn } from '@/lib/utils';

type DialogProps = DialogPrimitiveProps;

function Dialog(props: DialogProps) {
  return <DialogPrimitive {...props} />;
}

type DialogTriggerProps = DialogTriggerPrimitiveProps;

function DialogTrigger(props: DialogTriggerProps) {
  return <DialogTriggerPrimitive {...props} />;
}

type DialogCloseProps = DialogClosePrimitiveProps;

function DialogClose(props: DialogCloseProps) {
  return <DialogClosePrimitive {...props} />;
}

type DialogOverlayProps = DialogOverlayPrimitiveProps;

function DialogOverlay({ className, transition, ...props }: DialogOverlayProps) {
  const reduced = useReducedMotion();

  return (
    <DialogOverlayPrimitive
      className={cn('fixed inset-0 z-50 bg-bg/30', className)}
      transition={
        reduced ? { duration: 0 } : (transition ?? { duration: 0.18, ease: [0.16, 1, 0.3, 1] })
      }
      {...props}
    />
  );
}

type DialogContentProps = DialogContentPrimitiveProps & {
  showCloseButton?: boolean;
};

function DialogContent({
  className,
  children,
  showCloseButton = true,
  transition,
  ...props
}: DialogContentProps) {
  const reduced = useReducedMotion();

  return (
    <DialogPortalPrimitive>
      <DialogOverlay />
      <DialogContentPrimitive
        className={cn(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-2xl border border-line glass p-6 text-fg shadow-[0_18px_50px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.12)] outline-none sm:max-w-lg dark:shadow-[0_18px_50px_rgb(0_0_0/0.55),inset_0_1px_0_rgb(255_255_255/0.08)]',
          className,
        )}
        transition={
          reduced
            ? { duration: 0 }
            : (transition ?? { type: 'spring', stiffness: 380, damping: 32 })
        }
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClosePrimitive
            className="absolute top-3 right-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-xl text-dim outline-none transition-colors hover:bg-wash hover:text-fg focus-visible:bg-wash focus-visible:text-fg disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            aria-label="Close"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClosePrimitive>
        )}
      </DialogContentPrimitive>
    </DialogPortalPrimitive>
  );
}

type DialogHeaderProps = DialogHeaderPrimitiveProps;

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <DialogHeaderPrimitive
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

type DialogFooterProps = DialogFooterPrimitiveProps;

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <DialogFooterPrimitive
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

type DialogTitleProps = DialogTitlePrimitiveProps;

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogTitlePrimitive
      className={cn('text-base leading-none font-medium tracking-tight text-fg', className)}
      {...props}
    />
  );
}

type DialogDescriptionProps = DialogDescriptionPrimitiveProps;

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogDescriptionPrimitive
      className={cn('text-sm text-muted', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortalPrimitive as DialogPortal,
  type DialogProps,
  type DialogTriggerProps,
  type DialogCloseProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
};
