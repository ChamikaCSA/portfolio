"use client"

import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
  reverse?: boolean
  onComplete?: () => void
}

export const AnimatedList = React.memo(
  ({
    children,
    className,
    delay = 1000,
    reverse = true,
    onComplete,
    ...props
  }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )
    const onCompleteRef = React.useRef(onComplete)
    onCompleteRef.current = onComplete
    const completedRef = React.useRef(false)

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null

      if (index < childrenArray.length - 1) {
        timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
        }, delay)
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout)
        }
      }
    }, [index, delay, childrenArray.length])

    useEffect(() => {
      if (completedRef.current || childrenArray.length === 0) return
      if (index < childrenArray.length - 1) return

      const timeout = setTimeout(() => {
        completedRef.current = true
        onCompleteRef.current?.()
      }, 450)

      return () => {
        clearTimeout(timeout)
      }
    }, [index, childrenArray.length])

    const itemsToShow = useMemo(() => {
      const visible = childrenArray.slice(0, index + 1)
      return reverse ? visible.reverse() : visible
    }, [index, childrenArray, reverse])

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
