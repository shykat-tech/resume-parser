import { useEffect } from "react"
import { animate, motion, useMotionValue, useTransform } from "motion/react"

import { scoreTone, toneStroke } from "@/lib/score"

interface ScoreRingProps {
  score: number
  size?: number
  stroke?: number
}

export function ScoreRing({ score, size = 184, stroke = 12 }: ScoreRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const color = toneStroke[scoreTone(score)]

  const progress = useMotionValue(0)
  const offset = useTransform(progress, (v) => circumference * (1 - v / 100))
  const display = useTransform(progress, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(progress, score, { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 })
    return () => controls.stop()
  }, [progress, score])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        aria-hidden
        className="absolute inset-4 rounded-full opacity-40 blur-2xl"
        style={{ background: color }}
      />
      <svg width={size} height={size} className="relative -rotate-90" role="img" aria-label={`Match score ${score} out of 100`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-5xl font-semibold tabular-nums tracking-tight">{display}</motion.span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">out of 100</span>
      </div>
    </div>
  )
}
