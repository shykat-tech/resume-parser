import { AnimatePresence, motion } from "motion/react"
import { RotateCcw } from "lucide-react"

import type { ApiHealth, ApiHealthStatus } from "@/hooks/use-api-health"
import { cn } from "@/lib/utils"

const STATUS: Record<ApiHealthStatus, { label: string; dot: string; ping: boolean; text: string }> = {
  checking: {
    label: "Connecting to API…",
    dot: "bg-muted-foreground",
    ping: true,
    text: "text-muted-foreground",
  },
  waking: {
    label: "Waking up the API — this can take up to a minute",
    dot: "bg-warning",
    ping: true,
    text: "text-warning",
  },
  online: {
    label: "API online · AI-powered resume matching",
    dot: "bg-success",
    ping: true,
    text: "text-muted-foreground",
  },
  offline: {
    label: "API offline · retrying",
    dot: "bg-destructive",
    ping: false,
    text: "text-destructive",
  },
}

export function ApiStatus({ health }: { health: ApiHealth }) {
  const config = STATUS[health.status]
  const offline = health.status === "offline"

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ layout: { type: "spring", stiffness: 400, damping: 32 } }}
      onClick={offline ? health.retry : undefined}
      disabled={!offline}
      title={health.message ?? undefined}
      aria-live="polite"
      className={cn(
        "mx-auto mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs backdrop-blur",
        "disabled:cursor-default enabled:hover:border-destructive/50",
        offline && "border-destructive/30",
        config.text,
      )}
    >
      <span className="relative flex size-2">
        {config.ping && (
          <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-75", config.dot)} />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full transition-colors", config.dot)} />
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={health.status}
          layout="position"
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.25 }}
        >
          {config.label}
        </motion.span>
      </AnimatePresence>
      {offline && <RotateCcw className="size-3" aria-label="Retry now" />}
    </motion.button>
  )
}
