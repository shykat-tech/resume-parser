# Resume Parser — Frontend

React + TypeScript UI for the Resume Parser API (`backend/`). Built with Vite, Tailwind CSS v4,
shadcn/ui, and Motion (Framer Motion), with Aceternity-style animated components in
`src/components/aceternity/`.

## Run

```bash
# 1. Start the backend (from ../backend), on port 8000
uv run uvicorn app.main:app --reload

# 2. Start the frontend
npm install
npm run dev
```

In dev, Vite proxies `/api/*` to `http://127.0.0.1:8000`, so the backend needs no CORS setup.
Override the proxy target with `VITE_API_PROXY_TARGET`.

For a production build served from a different origin, set `VITE_API_BASE_URL`
(e.g. `https://api.example.com`) and enable CORS on the backend.

## Structure

```
src/
  App.tsx                     # idle → loading → results state machine
  lib/api.ts                  # POST /api/v1/matches client + response types
  lib/score.ts                # score → color/label mapping
  lib/sample.ts               # sample response for "View a sample report"
  components/
    match-form.tsx            # resume upload + job description form
    results/                  # score ring, criteria breakdown, skills, insights
    aceternity/               # spotlight/grid background, file upload, loader, text reveal, glow card
    ui/                       # shadcn/ui components
```
