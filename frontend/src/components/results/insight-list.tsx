import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface InsightListProps {
  items: string[]
  icon: LucideIcon
  iconClassName: string
  emptyMessage: string
}

export function InsightList({ items, icon: Icon, iconClassName, emptyMessage }: InsightListProps) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.07 }}
          className="flex gap-3 text-sm leading-relaxed"
        >
          <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", iconClassName)}>
            <Icon className="size-3" />
          </span>
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}
