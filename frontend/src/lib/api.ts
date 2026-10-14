export interface MatchCriterion {
  name: string
  score: number
  weight: number
  explanation: string
}

export interface ResumeMatchResponse {
  overall_score: number
  summary: string
  matched_skills: string[]
  missing_skills: string[]
  strengths: string[]
  concerns: string[]
  criteria: MatchCriterion[]
}

// Mirrors the validation in backend/app/main.py so users get instant feedback.
export const ACCEPTED_EXTENSIONS = [".pdf", ".docx"] as const
export const MAX_FILE_BYTES = 5 * 1024 * 1024
export const JD_MIN_LENGTH = 50
export const JD_MAX_LENGTH = 20_000

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ""

// Free hosts (e.g. Render) sleep when idle. Ping on page load so the backend
// is waking up while the user fills in the form.
export function wakeBackend() {
  fetch(`${API_BASE}/api/v1/health`).catch(() => {})
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function validateResumeFile(file: File): string | null {
  const name = file.name.toLowerCase()
  if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Only PDF and DOCX files are supported."
  }
  if (file.size > MAX_FILE_BYTES) {
    return "Resume must be 5 MB or smaller."
  }
  return null
}

// FastAPI returns `detail` as a string for HTTPException and as a list of
// validation errors for request validation failures.
function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object" || !("detail" in body)) return fallback
  const { detail } = body as { detail: unknown }
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (item && typeof item === "object" && "msg" in item ? String(item.msg) : null))
      .filter(Boolean)
    if (messages.length) return messages.join(" ")
  }
  return fallback
}

export async function createMatch(
  file: File,
  jobDescription: string,
  signal?: AbortSignal,
): Promise<ResumeMatchResponse> {
  const form = new FormData()
  form.append("file", file)
  form.append("job_description", jobDescription)

  let response: Response
  try {
    response = await fetch(`${API_BASE}/api/v1/matches`, {
      method: "POST",
      body: form,
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error
    throw new ApiError("Could not reach the Resume Parser API. Is the backend running?", 0)
  }

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(body, `Request failed with status ${response.status}.`),
      response.status,
    )
  }

  return body as ResumeMatchResponse
}
