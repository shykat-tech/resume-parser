import { useRef, type ReactNode } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

// Aceternity-style card whose border and surface glow follow the cursor.
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, color-mix(in oklch, var(--brand) 14%, transparent), transparent 70%)`

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set(e.clientX - rect.left)
        y.set(e.clientY - rect.top)
      }}
      onMouseLeave={() => {
        x.set(-500)
        y.set(-500)
      }}
      className={cn(
        "group/glow relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div className="relative">{children}</div>
    </div>
  )
}
