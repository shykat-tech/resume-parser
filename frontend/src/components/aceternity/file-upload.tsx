import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FileText, UploadCloud, X } from "lucide-react"

import { ACCEPTED_EXTENSIONS } from "@/lib/api"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  error?: string | null
  disabled?: boolean
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// Aceternity-style dropzone: a floating card that lifts on hover and
// morphs into a file preview once a resume is chosen.
export function FileUpload({ file, onChange, error, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const pick = (files: FileList | null) => {
    const next = files?.[0]
    if (next) onChange(next)
  }

  return (
    <motion.div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload resume"
      aria-invalid={!!error}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) pick(e.dataTransfer.files)
      }}
      whileHover={disabled ? undefined : "hover"}
      className={cn(
        "group/file relative flex w-full flex-1 flex-col justify-center overflow-hidden rounded-xl border border-dashed p-6 outline-none transition-colors",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        dragging ? "border-brand bg-brand/5" : "border-border hover:border-brand/50",
        error && "border-destructive/60",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        onChange={(e) => {
          pick(e.target.files)
          e.target.value = ""
        }}
      />

      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <GridPattern />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <p className="text-sm font-semibold">Upload resume</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Drag &amp; drop or click · PDF or DOCX · up to 5 MB
        </p>

        <div className="relative mt-6 w-full max-w-sm">
          <AnimatePresence mode="popLayout" initial={false}>
            {file ? (
              <motion.div
                key="file"
                layoutId="file-card"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex items-center gap-3 rounded-lg border bg-card p-3 text-left shadow-sm backdrop-blur"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)} · {file.name.split(".").pop()?.toUpperCase()}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(null)
                  }}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                layoutId="file-card"
                variants={{ hover: { x: 14, y: -14, rotate: 2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-lg bg-card shadow-[0_10px_50px_rgba(0,0,0,0.12)] ring-1 ring-border"
              >
                <motion.div
                  animate={dragging ? { y: [-2, 2, -2] } : { y: 0 }}
                  transition={{ repeat: dragging ? Infinity : 0, duration: 0.8 }}
                >
                  <UploadCloud className="size-6 text-muted-foreground transition-colors group-hover/file:text-brand" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {!file && (
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              className="absolute inset-0 mx-auto h-24 w-24 rounded-lg border border-dashed border-brand"
            />
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 text-xs font-medium text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function GridPattern() {
  const columns = 41
  const rows = 11
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-px bg-muted/40">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => (
          <div
            key={`${col}-${row}`}
            className={cn(
              "size-10 shrink-0 rounded-[2px]",
              (row * columns + col) % 2 === 0
                ? "bg-background"
                : "bg-background shadow-[0px_0px_1px_3px_var(--background)_inset]",
            )}
          />
        )),
      )}
    </div>
  )
}
