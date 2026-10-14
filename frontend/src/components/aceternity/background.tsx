import { cn } from "@/lib/utils"

// Aceternity-style grid background with a radial fade and an animated spotlight.
export function GridBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      <div
        className="absolute inset-0 [background-size:44px_44px] opacity-60
          [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)]
          [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />
      <Spotlight className="top-0 left-1/2" />
      <div className="absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-brand-2/15 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] size-[30rem] rounded-full bg-brand/10 blur-3xl" />
    </div>
  )
}

function Spotlight({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spotlight absolute h-[140%] w-[160%] opacity-0 lg:w-[90%]", className)}
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#spotlight-blur)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill="var(--brand)"
          fillOpacity="0.16"
        />
      </g>
      <defs>
        <filter
          id="spotlight-blur"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  )
}
