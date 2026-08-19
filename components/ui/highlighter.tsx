"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { type RoughAnnotation } from "rough-notation/lib/model"

import { cn } from "@/lib/utils"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  delay?: number
  className?: string
}

export function Highlighter({
  children,
  action = "highlight",
  color,
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 1,
  padding = 2,
  multiline = true,
  isView = false,
  delay = 0,
  className,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(elementRef, {
    once: true,
    amount: 0.6,
  })
  const shouldShow = !isView || isInView

  useEffect(() => {
    if (!shouldShow) return

    let cancelled = false
    let annotation: RoughAnnotation | null = null
    let idleId = 0

    const draw = async () => {
      const { annotate } = await import("rough-notation")
      if (cancelled || !elementRef.current) return

      const resolved = color ?? "#c8f542"

      annotation = annotate(elementRef.current, {
        type: action,
        color: resolved,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      })
      annotation.show()
    }

    const start = () => {
      if (cancelled) return
      if (typeof requestIdleCallback === "function") {
        idleId = requestIdleCallback(() => void draw(), { timeout: 800 })
        return
      }
      void draw()
    }

    const delayId = window.setTimeout(start, delay)

    return () => {
      cancelled = true
      window.clearTimeout(delayId)
      if (idleId && typeof cancelIdleCallback === "function") {
        cancelIdleCallback(idleId)
      }
      annotation?.remove()
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    delay,
  ])

  return (
    <span
      ref={elementRef}
      className={cn("relative inline-block bg-transparent", className)}
    >
      {children}
    </span>
  )
}
