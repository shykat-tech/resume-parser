import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Check, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface MultiStepLoaderProps {
  steps: string[]
  /** Time spent on each step before advancing. The last step waits until the request settles. */
  stepDuration?: number
}

// Aceternity-style multi step loader. The backend does all of this in one request,
// so the steps advance on a timer and hold on the final one until the response arrives.
export function MultiStepLoader({ steps, stepDuration = 1800 }: MultiStepLoaderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (current >= steps.length - 1) return
    const timer = setTimeout(() => setCurrent((c) => c + 1), stepDuration)
    return () => clearTimeout(timer)
  }, [current, steps.length, stepDuration])

  return (
    <div className="relative mx-auto w-full max-w-sm" role="status" aria-live="polite">
      {steps.map((step, index) => {
        const distance = Math.abs(index - current)
        const done = index < current
        const active = index === current
        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: Math.max(1 - distance * 0.25, 0.3), x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
            className="mb-4 flex h-6 items-center gap-3 text-left last:mb-0"
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                done && "border-success bg-success/15 text-success",
                active && "border-brand text-brand",
              )}
            >
              {done ? (
                <Check className="size-3.5" />
              ) : active ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <span className="size-1.5 rounded-full bg-muted-foreground/50" />
              )}
            </span>
            <span className={cn("text-sm", active ? "font-medium text-foreground" : "text-muted-foreground")}>
              {step}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
