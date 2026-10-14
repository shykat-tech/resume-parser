import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FileSearch, RotateCcw, XCircle } from "lucide-react"
import { toast } from "sonner"

import { GridBackground } from "@/components/aceternity/background"
import { GlowCard } from "@/components/aceternity/glow-card"
import { MultiStepLoader } from "@/components/aceternity/multi-step-loader"
import { MatchForm, type MatchDraft } from "@/components/match-form"
import { ResultsView } from "@/components/results/results-view"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { createMatch, wakeBackend, type ResumeMatchResponse } from "@/lib/api"
import { sampleMatch } from "@/lib/sample"

type ViewState =
  | { status: "idle" }
  | { status: "loading"; fileName: string }
  | { status: "success"; fileName: string; result: ResumeMatchResponse }

const LOADING_STEPS = [
  "Uploading resume",
  "Extracting resume text",
  "Reading the job description",
  "Comparing skills & experience",
  "Scoring each criterion",
]

const pageTransition = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(6px)" },
  transition: { duration: 0.35 },
}

export default function App() {
  const [view, setView] = useState<ViewState>({ status: "idle" })
  const [draft, setDraft] = useState<MatchDraft>({ file: null, jobDescription: "" })
  const abortRef = useRef<AbortController | null>(null)

  useEffect(wakeBackend, [])

  // Each view starts at the top; otherwise mobile users land mid-report.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [view.status])

  const analyze = async ({ file, jobDescription }: { file: File; jobDescription: string }) => {
    setDraft({ file, jobDescription })
    const controller = new AbortController()
    abortRef.current = controller
    setView({ status: "loading", fileName: file.name })

    try {
      const result = await createMatch(file, jobDescription, controller.signal)
      setView({ status: "success", fileName: file.name, result })
    } catch (error) {
      if (controller.signal.aborted) return
      setView({ status: "idle" })
      toast.error("Analysis failed", {
        description: error instanceof Error ? error.message : "Something went wrong.",
      })
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  const cancel = () => {
    abortRef.current?.abort()
    setView({ status: "idle" })
  }

  const reset = () => {
    setView({ status: "idle" })
  }

  return (
    <div className="relative min-h-svh">
      <GridBackground />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <button type="button" onClick={reset} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 text-primary-foreground shadow-[0_4px_20px_-4px_var(--brand)]">
            <FileSearch className="size-4" />
          </span>
          Resume Parser
        </button>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
        <AnimatePresence mode="wait">
          {view.status === "idle" && (
            <motion.div key="idle" {...pageTransition}>
              <Hero />
              <MatchForm
                initialDraft={draft}
                onSubmit={analyze}
                onShowSample={() => setView({ status: "success", fileName: "sample-resume.pdf", result: sampleMatch })}
              />
            </motion.div>
          )}

          {view.status === "loading" && (
            <motion.div key="loading" {...pageTransition} className="mx-auto max-w-md">
              <GlowCard className="p-8">
                <div className="mb-8 text-center">
                  <div className="relative mx-auto mb-5 size-14">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,var(--brand),var(--brand-2))]"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                    />
                    <span className="absolute inset-[3px] flex items-center justify-center rounded-full bg-background">
                      <FileSearch className="size-5 text-brand" />
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold">Analyzing your match</h2>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{view.fileName}</p>
                </div>
                <MultiStepLoader steps={LOADING_STEPS} />
                <div className="mt-8 flex justify-center">
                  <Button variant="ghost" size="sm" onClick={cancel}>
                    <XCircle data-icon="inline-start" />
                    Cancel
                  </Button>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {view.status === "success" && (
            <motion.div key="success" {...pageTransition}>
              <ResultsView result={view.result} fileName={view.fileName} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view.status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="fixed right-4 bottom-4 sm:hidden"
        >
          <Button onClick={reset} size="icon-lg" className="rounded-full shadow-lg" aria-label="New analysis">
            <RotateCcw />
          </Button>
        </motion.div>
      )}
    </div>
  )
}

function Hero() {
  return (
    <div className="mb-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground backdrop-blur"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        AI-powered resume matching
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
      >
        See how well a resume{" "}
        <span className="bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">fits the role</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground"
      >
        Upload a resume and paste a job description. Get a weighted match score, skill gaps, strengths and concerns
        in seconds.
      </motion.p>
    </div>
  )
}
