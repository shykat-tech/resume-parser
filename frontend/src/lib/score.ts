export type ScoreTone = "success" | "brand" | "warning" | "destructive"

export function scoreTone(score: number): ScoreTone {
  if (score >= 85) return "success"
  if (score >= 70) return "brand"
  if (score >= 50) return "warning"
  return "destructive"
}

export function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent match"
  if (score >= 70) return "Strong match"
  if (score >= 50) return "Partial match"
  return "Weak match"
}

// Tailwind needs full class names at build time, so map tones explicitly.
export const toneText: Record<ScoreTone, string> = {
  success: "text-success",
  brand: "text-brand",
  warning: "text-warning",
  destructive: "text-destructive",
}

export const toneBg: Record<ScoreTone, string> = {
  success: "bg-success",
  brand: "bg-brand",
  warning: "bg-warning",
  destructive: "bg-destructive",
}

export const toneStroke: Record<ScoreTone, string> = {
  success: "var(--success)",
  brand: "var(--brand)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
}
