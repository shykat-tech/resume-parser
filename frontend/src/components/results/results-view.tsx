import { motion } from "motion/react"
import { AlertTriangle, ArrowLeft, Sparkles, ThumbsUp } from "lucide-react"
import type { ReactNode } from "react"

import { GlowCard } from "@/components/aceternity/glow-card"
import { TextGenerate } from "@/components/aceternity/text-generate"
import { CriteriaList } from "@/components/results/criteria-list"
import { InsightList } from "@/components/results/insight-list"
import { ScoreRing } from "@/components/results/score-ring"
import { SkillCloud } from "@/components/results/skill-cloud"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ResumeMatchResponse } from "@/lib/api"
import { scoreLabel, scoreTone, toneText } from "@/lib/score"
import { cn } from "@/lib/utils"

interface ResultsViewProps {
  result: ResumeMatchResponse
  fileName: string
  onReset: () => void
}

export function ResultsView({ result, fileName, onReset }: ResultsViewProps) {
  const tone = scoreTone(result.overall_score)
  const totalSkills = result.matched_skills.length + result.missing_skills.length
  const coverage = totalSkills ? Math.round((result.matched_skills.length / totalSkills) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <ArrowLeft data-icon="inline-start" />
          New analysis
        </Button>
        <Badge variant="secondary" className="max-w-full truncate">
          {fileName}
        </Badge>
      </div>

      <Section delay={0}>
        <GlowCard className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
            <ScoreRing score={result.overall_score} />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <p className={cn("text-sm font-semibold uppercase tracking-widest", toneText[tone])}>
                  {scoreLabel(result.overall_score)}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Match report</h2>
              </div>
              <TextGenerate text={result.summary} className="text-muted-foreground" delay={0.3} />
              <div className="grid grid-cols-3 gap-3 pt-2">
                <Stat label="Skills matched" value={`${result.matched_skills.length}/${totalSkills}`} />
                <Stat label="Skill coverage" value={`${coverage}%`} />
                <Stat label="Concerns" value={String(result.concerns.length)} />
              </div>
            </div>
          </div>
        </GlowCard>
      </Section>

      <Section delay={0.1}>
        <GlowCard className="p-6">
          <CardHeading title="Score breakdown" subtitle="How each criterion contributed to the overall score" />
          <CriteriaList criteria={result.criteria} />
        </GlowCard>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section delay={0.2}>
          <GlowCard className="h-full p-6">
            <CardHeading title="Matched skills" count={result.matched_skills.length} />
            <SkillCloud skills={result.matched_skills} variant="matched" emptyMessage="No matching skills found." />
          </GlowCard>
        </Section>
        <Section delay={0.25}>
          <GlowCard className="h-full p-6">
            <CardHeading title="Missing skills" count={result.missing_skills.length} />
            <SkillCloud
              skills={result.missing_skills}
              variant="missing"
              emptyMessage="Nothing missing — every required skill is covered."
            />
          </GlowCard>
        </Section>
        <Section delay={0.3}>
          <GlowCard className="h-full p-6">
            <CardHeading title="Strengths" count={result.strengths.length} />
            <InsightList
              items={result.strengths}
              icon={ThumbsUp}
              iconClassName="bg-success/15 text-success"
              emptyMessage="No notable strengths identified."
            />
          </GlowCard>
        </Section>
        <Section delay={0.35}>
          <GlowCard className="h-full p-6">
            <CardHeading title="Concerns" count={result.concerns.length} />
            <InsightList
              items={result.concerns}
              icon={AlertTriangle}
              iconClassName="bg-warning/15 text-warning"
              emptyMessage="No concerns raised."
            />
          </GlowCard>
        </Section>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="size-3" />
        AI-generated assessment. Use it to support, not replace, your judgement.
      </p>
    </div>
  )
}

function Section({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      {children}
    </motion.section>
  )
}

function CardHeading({ title, subtitle, count }: { title: string; subtitle?: string; count?: number }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">{title}</h3>
        {count !== undefined && (
          <Badge variant="secondary" className="tabular-nums">
            {count}
          </Badge>
        )}
      </div>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background/40 px-3 py-2.5">
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
