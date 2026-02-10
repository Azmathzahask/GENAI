// In production on Vercel, backend is deployed as `/api` (serverless).
// In local dev, you can set `VITE_API_BASE_URL=http://127.0.0.1:8000`.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export type ResumeAnalysis = {
  summary: string
  detected_skills: string[]
  missing_skills: string[]
  suggested_improvements: string[]
}

export async function uploadResume(file: File): Promise<ResumeAnalysis> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE_URL}/resume/parse`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Failed to parse resume')
  }
  return (await res.json()) as ResumeAnalysis
}

export type SkillEvaluationRequest = {
  target_role: string
  current_skills: string[]
  experience_years: number
}

export type SkillGap = {
  skill: string
  level: string
  priority: string
}

export type SkillEvaluationResponse = {
  role: string
  strengths: string[]
  gaps: SkillGap[]
  summary: string
}

export async function evaluateSkills(payload: SkillEvaluationRequest): Promise<SkillEvaluationResponse> {
  const res = await fetch(`${API_BASE_URL}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to evaluate skills')
  return (await res.json()) as SkillEvaluationResponse
}

export type TrainingPlanResponse = {
  role: string
  duration_weeks: number
  plan: { week: number; focus: string; resources: string[] }[]
}

export async function generatePlan(payload: {
  target_role: string
  gaps: string[]
  weeks_available: number
}): Promise<TrainingPlanResponse> {
  const res = await fetch(`${API_BASE_URL}/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to generate plan')
  return (await res.json()) as TrainingPlanResponse
}

export type QuizQuestion = {
  id: number
  question: string
  options: string[]
  correct_index: number
}

export async function generateQuiz(payload: {
  domain: string
  difficulty: string
  num_questions: number
}): Promise<QuizQuestion[]> {
  const res = await fetch(`${API_BASE_URL}/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to generate quiz')
  return (await res.json()) as QuizQuestion[]
}

export type QuizResult = {
  score: number
  total: number
  feedback: string
}

export async function submitQuiz(answers: number[]): Promise<QuizResult> {
  const res = await fetch(`${API_BASE_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
  if (!res.ok) throw new Error('Failed to submit quiz')
  return (await res.json()) as QuizResult
}

export type InterviewQuestion = {
  id: number
  question: string
  hint?: string | null
}

export type InterviewFeedback = {
  score: number
  strengths: string[]
  improvements: string[]
}

export async function startInterview(payload: {
  target_role: string
  experience_years: number
}): Promise<InterviewQuestion[]> {
  const res = await fetch(`${API_BASE_URL}/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to start interview')
  return (await res.json()) as InterviewQuestion[]
}

export async function getInterviewFeedback(answers: { question_id: number; answer: string }[]) {
  const res = await fetch(`${API_BASE_URL}/interview/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
  })
  if (!res.ok) throw new Error('Failed to get feedback')
  return (await res.json()) as InterviewFeedback
}

export type JobRecommendation = {
  title: string
  company: string
  location: string
  match_score: number
}

export async function fetchJobs(payload: {
  target_role: string
  location_preference?: string
}): Promise<JobRecommendation[]> {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to fetch jobs')
  return (await res.json()) as JobRecommendation[]
}

export type ProgressItem = {
  module: string
  completed: number
  total: number
}

export type ProgressResponse = {
  items: ProgressItem[]
}

export async function fetchProgress(): Promise<ProgressResponse> {
  const res = await fetch(`${API_BASE_URL}/progress`)
  if (!res.ok) throw new Error('Failed to fetch progress')
  return (await res.json()) as ProgressResponse
}

