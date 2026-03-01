"use client"
import { ComponentPropsWithoutRef, useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
  suffix?: string
  once?: boolean
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  suffix,
  once = true,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 40, // faster animation
    stiffness: 150,
  })
  const isInView = useInView(ref, { once, margin: "-50px" })

  // Trigger animation
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    } else if (!once) {
      // reset when leaving viewport to allow replay
      motionValue.set(direction === "down" ? value : startValue)
    }
  }, [isInView, motionValue, delay, value, direction, startValue, once])

  // Update DOM with formatted number
  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        let number = Number(latest.toFixed(decimalPlaces))

        // Format with decimals
        let formatted = number.toLocaleString("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        })

        // Add leading 0 if < 10 and no 0 yet
        if (number < 10 && !formatted.startsWith("0")) {
          formatted = "0" + formatted
        }

        ref.current.textContent = formatted + (suffix || "")
      }
    })
  }, [springValue, decimalPlaces, suffix])

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className
      )}
      {...props}
    >
      {/* Initial display */}
      {startValue < 10 ? "0" + startValue : startValue}
      {suffix}
    </span>
  )
}
