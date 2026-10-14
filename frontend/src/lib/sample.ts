import type { ResumeMatchResponse } from "@/lib/api"

// A real response from POST /api/v1/matches, used for the "View sample report" demo.
export const sampleMatch: ResumeMatchResponse = {
  overall_score: 91,
  summary:
    "The candidate meets all required technical skills, has over 2 years of relevant frontend experience, holds a Computer Science degree, and demonstrates alignment with the job responsibilities.",
  matched_skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "REST API integration",
    "responsive design",
    "Git",
    "component-based architecture",
  ],
  missing_skills: [],
  strengths: [
    "3 years of React and TypeScript development",
    "Proven performance optimization (20% load‑time reduction)",
    "Experience with unit testing and code reviews",
    "Collaboration with backend engineers",
    "B.Sc. in Computer Science",
  ],
  concerns: [
    'The resume does not explicitly use the phrase "component‑based architecture", though it is implied by React experience',
  ],
  criteria: [
    {
      name: "Technical skills",
      score: 90,
      weight: 40,
      explanation:
        "Resume lists React, TypeScript, JavaScript, HTML, CSS, Git, and REST API integration, and shows responsive UI work, covering all required technical skills. Component‑based architecture is implied by React usage.",
    },
    {
      name: "Relevant experience",
      score: 92,
      weight: 30,
      explanation:
        "Candidate has 3 years of web application development, exceeding the 2‑year minimum, with specific work on React/TS features, responsive design, performance tuning, and collaboration with backend teams.",
    },
    {
      name: "Required qualifications",
      score: 95,
      weight: 15,
      explanation: "Holds a B.Sc. in Computer Science, satisfying the preferred educational qualification.",
    },
    {
      name: "Responsibilities alignment",
      score: 90,
      weight: 15,
      explanation:
        "Resume demonstrates responsibilities matching the job: building frontend features, integrating REST APIs, optimizing performance, writing unit tests, participating in code reviews, and working with backend engineers.",
    },
  ],
}
