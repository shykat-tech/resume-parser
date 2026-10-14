import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { MatchCriterion } from "@/lib/api"
import { scoreTone, toneBg, toneText } from "@/lib/score"
import { cn } from "@/lib/utils"

export function CriteriaList({ criteria }: { criteria: MatchCriterion[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <ul className="divide-y">
      {criteria.map((criterion, index) => {
        const tone = scoreTone(criterion.score)
        const expanded = open === index
        return (
          <motion.li
            key={criterion.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.08 }}
          >
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : index)}
              aria-expanded={expanded}
              className="flex w-full flex-col gap-3 py-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex-1 text-sm font-medium">{criterion.name}</span>
                <Badge variant="outline" className="text-muted-foreground">
                  {criterion.weight}% weight
                </Badge>
                <span className={cn("w-10 text-right text-sm font-semibold tabular-nums", toneText[tone])}>
                  {criterion.score}
                </span>
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-muted-foreground">
                  <ChevronDown className="size-4" />
                </motion.span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", toneBg[tone])}
                  initial={{ width: 0 }}
                  animate={{ width: `${criterion.score}%` }}
                  transition={{ duration: 1.1, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="block pb-4">{criterion.explanation}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </ul>
  )
}
