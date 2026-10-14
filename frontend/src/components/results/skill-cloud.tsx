import { motion } from "motion/react"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

interface SkillCloudProps {
  skills: string[]
  variant: "matched" | "missing"
  emptyMessage: string
}

export function SkillCloud({ skills, variant, emptyMessage }: SkillCloudProps) {
  if (!skills.length) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  const Icon = variant === "matched" ? Check : Minus

  return (
    <motion.ul
      className="flex flex-wrap gap-2"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } } }}
    >
      {skills.map((skill) => (
        <motion.li
          key={skill}
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 6 },
            show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 22 } },
          }}
          whileHover={{ y: -2 }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            variant === "matched"
              ? "border-success/30 bg-success/10 text-success"
              : "border-destructive/30 bg-destructive/10 text-destructive",
          )}
        >
          <Icon className="size-3" />
          {skill}
        </motion.li>
      ))}
    </motion.ul>
  )
}
