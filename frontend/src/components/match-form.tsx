import { useState, type FormEvent } from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { ArrowRight, Briefcase } from "lucide-react"

import { FileUpload } from "@/components/aceternity/file-upload"
import { GlowCard } from "@/components/aceternity/glow-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { JD_MAX_LENGTH, JD_MIN_LENGTH, validateResumeFile } from "@/lib/api"
import { cn } from "@/lib/utils"

export interface MatchDraft {
  file: File | null
  jobDescription: string
}

interface MatchFormProps {
  /** Restores the previous inputs, e.g. after a failed request or "New analysis". */
  initialDraft: MatchDraft
  onSubmit: (draft: { file: File; jobDescription: string }) => void
  onShowSample: () => void
}

export function MatchForm({ initialDraft, onSubmit, onShowSample }: MatchFormProps) {
  const [file, setFile] = useState<File | null>(initialDraft.file)
  const [fileError, setFileError] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState(initialDraft.jobDescription)
  const [touched, setTouched] = useState(false)

  const jdLength = jobDescription.trim().length
  const jdError =
    jdLength < JD_MIN_LENGTH
      ? `Add at least ${JD_MIN_LENGTH - jdLength} more characters.`
      : jdLength > JD_MAX_LENGTH
        ? `Job description must be under ${JD_MAX_LENGTH.toLocaleString()} characters.`
        : null
  const canSubmit = !!file && !fileError && !jdError

  const handleFile = (next: File | null) => {
    setFile(next)
    setFileError(next ? validateResumeFile(next) : null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!file) {
      setFileError("Please choose a resume to analyze.")
      return
    }
    if (canSubmit) onSubmit({ file, jobDescription: jobDescription.trim() })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      noValidate
    >
      <GlowCard className="p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <StepLabel step={1} title="Resume" />
            <FileUpload file={file} onChange={handleFile} error={fileError} />
          </div>

          <div className="flex flex-col gap-2">
            <StepLabel step={2} title="Job description" />
            <div className="relative flex flex-1 flex-col">
              <Briefcase className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Paste the full job description — responsibilities, required skills, qualifications…"
                aria-invalid={touched && !!jdError}
                className="min-h-56 flex-1 resize-none bg-background/40 pl-9 text-sm leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={cn("text-muted-foreground", touched && jdError && "text-destructive")}>
                {touched && jdError ? jdError : "Minimum 50 characters"}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {jdLength.toLocaleString()} / {JD_MAX_LENGTH.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <Button type="button" variant="link" size="sm" onClick={onShowSample} className="text-muted-foreground">
            View a sample report
          </Button>
          <ShimmerButton type="submit" disabled={touched && !canSubmit}>
            Analyze match
            <ArrowRight className="size-4 transition-transform group-hover/shimmer:translate-x-0.5" />
          </ShimmerButton>
        </div>
      </GlowCard>
    </motion.form>
  )
}

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="flex size-5 items-center justify-center rounded-full bg-brand/15 text-xs text-brand">
        {step}
      </span>
      {title}
    </div>
  )
}

// Aceternity-style shimmer button.
function ShimmerButton({ className, children, ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group/shimmer inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand/40 px-6 text-sm font-semibold text-primary-foreground sm:w-auto",
        "animate-shimmer bg-[linear-gradient(110deg,var(--primary),45%,color-mix(in_oklch,var(--primary)_60%,white),55%,var(--primary))] bg-[length:200%_100%]",
        "shadow-[0_8px_30px_-8px_var(--brand)] outline-none transition-opacity focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
