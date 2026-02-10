import { FormEvent, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import {
  API_BASE_URL,
  uploadResume,
  evaluateSkills,
  generatePlan,
  generateQuiz,
  submitQuiz,
  startInterview,
  getInterviewFeedback,
  fetchJobs,
  fetchProgress,
  type ResumeAnalysis,
  type SkillEvaluationResponse,
  type TrainingPlanResponse,
  type QuizQuestion,
  type QuizResult,
  type InterviewQuestion,
  type InterviewFeedback,
  type JobRecommendation,
  type ProgressResponse,
} from './api'

function App() {
  return (
    <div className="vm-root">
      <aside className="vm-sidebar">
        <h1 className="vm-logo">VidyāMitra</h1>
        <div className="vm-api-url">API: {API_BASE_URL}</div>
        <nav className="vm-nav">
          <NavLink to="/" end className="vm-nav-item">
            Dashboard
          </NavLink>
          <NavLink to="/resume" className="vm-nav-item">
            Resume Evaluation
          </NavLink>
          <NavLink to="/skills" className="vm-nav-item">
            Skill Mapping
          </NavLink>
          <NavLink to="/plan" className="vm-nav-item">
            Training Planner
          </NavLink>
          <NavLink to="/quiz" className="vm-nav-item">
            Quiz
          </NavLink>
          <NavLink to="/interview" className="vm-nav-item">
            Mock Interview
          </NavLink>
          <NavLink to="/jobs" className="vm-nav-item">
            Job Recommendations
          </NavLink>
          <NavLink to="/progress" className="vm-nav-item">
            Progress
          </NavLink>
        </nav>
      </aside>
      <main className="vm-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>
    </div>
  )
}

function DashboardPage() {
  return (
    <section>
      <h2>Career Dashboard</h2>
      <p>
        Welcome to VidyāMitra – upload your resume, explore skill gaps, practice interviews, and
        track your progress in one place.
      </p>
    </section>
  )
}

function ResumePage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResumeAnalysis | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!file) {
      setError('Please select a resume file.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await uploadResume(file)
      setResult(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Resume Evaluation</h2>
      <form onSubmit={handleSubmit} className="vm-form">
        <label className="vm-field">
          <span>Upload resume (PDF/DOCX)</span>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <button type="submit" disabled={loading} className="vm-button">
          {loading ? 'Analyzing…' : 'Analyze Resume'}
        </button>
      </form>
      {error && <p className="vm-error">{error}</p>}
      {result && (
        <div className="vm-card-grid">
          <div className="vm-card">
            <h3>Summary</h3>
            <p>{result.summary}</p>
          </div>
          <div className="vm-card">
            <h3>Detected skills</h3>
            <ul>{result.detected_skills.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="vm-card">
            <h3>Missing skills</h3>
            <ul>{result.missing_skills.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="vm-card">
            <h3>Suggestions</h3>
            <ul>{result.suggested_improvements.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      )}
    </section>
  )
}

function SkillsPage() {
  const [role, setRole] = useState('Data Analyst')
  const [skills, setSkills] = useState('Python, SQL, Excel')
  const [years, setYears] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SkillEvaluationResponse | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        target_role: role,
        current_skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        experience_years: years,
      }
      const data = await evaluateSkills(payload)
      setResult(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Skill Mapping</h2>
      <form onSubmit={handleSubmit} className="vm-form">
        <label className="vm-field">
          <span>Target role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <label className="vm-field">
          <span>Current skills (comma-separated)</span>
          <input value={skills} onChange={(e) => setSkills(e.target.value)} />
        </label>
        <label className="vm-field">
          <span>Years of experience</span>
          <input
            type="number"
            min={0}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading} className="vm-button">
          {loading ? 'Evaluating…' : 'Evaluate Skills'}
        </button>
      </form>
      {error && <p className="vm-error">{error}</p>}
      {result && (
        <div className="vm-card-grid">
          <div className="vm-card">
            <h3>Summary</h3>
            <p>{result.summary}</p>
          </div>
          <div className="vm-card">
            <h3>Strengths</h3>
            <ul>{result.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="vm-card">
            <h3>Skill gaps</h3>
            <ul>
              {result.gaps.map((g) => (
                <li key={g.skill}>
                  {g.skill} – {g.level} ({g.priority} priority)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

function PlanPage() {
  const [role, setRole] = useState('Data Analyst')
  const [gaps, setGaps] = useState('Data Visualization, Cloud Fundamentals')
  const [weeks, setWeeks] = useState(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TrainingPlanResponse | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        target_role: role,
        gaps: gaps.split(',').map((s) => s.trim()).filter(Boolean),
        weeks_available: weeks,
      }
      const data = await generatePlan(payload)
      setResult(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Training Planner</h2>
      <form onSubmit={handleSubmit} className="vm-form">
        <label className="vm-field">
          <span>Target role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <label className="vm-field">
          <span>Skill gaps (comma-separated)</span>
          <input value={gaps} onChange={(e) => setGaps(e.target.value)} />
        </label>
        <label className="vm-field">
          <span>Weeks available</span>
          <input
            type="number"
            min={1}
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading} className="vm-button">
          {loading ? 'Generating…' : 'Generate Plan'}
        </button>
      </form>
      {error && <p className="vm-error">{error}</p>}
      {result && (
        <div className="vm-card">
          <h3>
            {result.role} – {result.duration_weeks} weeks
          </h3>
          <ol>
            {result.plan.map((p) => (
              <li key={p.week}>
                <strong>Week {p.week}:</strong> {p.focus}
                <ul>
                  {p.resources.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}

function QuizPage() {
  const [domain, setDomain] = useState('Programming')
  const [difficulty, setDifficulty] = useState('medium')
  const [numQuestions, setNumQuestions] = useState(2)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const qs = await generateQuiz({ domain, difficulty, num_questions: numQuestions })
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(-1))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitQuiz() {
    setLoading(true)
    setError(null)
    try {
      const res = await submitQuiz(answers)
      setResult(res)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Quiz Module</h2>
      <form onSubmit={handleGenerate} className="vm-form">
        <label className="vm-field">
          <span>Domain</span>
          <input value={domain} onChange={(e) => setDomain(e.target.value)} />
        </label>
        <label className="vm-field">
          <span>Difficulty</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="vm-field">
          <span>Number of questions</span>
          <input
            type="number"
            min={1}
            max={10}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading} className="vm-button">
          {loading ? 'Preparing…' : 'Generate Quiz'}
        </button>
      </form>
      {error && <p className="vm-error">{error}</p>}
      {questions.length > 0 && (
        <div className="vm-card">
          <ol>
            {questions.map((q, qi) => (
              <li key={q.id} className="vm-quiz-question">
                <p>{q.question}</p>
                <div className="vm-quiz-options">
                  {q.options.map((opt, oi) => (
                    <label key={oi}>
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={answers[qi] === oi}
                        onChange={() =>
                          setAnswers((prev) => {
                            const next = [...prev]
                            next[qi] = oi
                            return next
                          })
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <button onClick={handleSubmitQuiz} disabled={loading} className="vm-button">
            {loading ? 'Scoring…' : 'Submit Quiz'}
          </button>
        </div>
      )}
      {result && (
        <div className="vm-card">
          <h3>
            Score: {result.score} / {result.total}
          </h3>
          <p>{result.feedback}</p>
        </div>
      )}
    </section>
  )
}

function InterviewPage() {
  const [role, setRole] = useState('Data Analyst')
  const [years, setYears] = useState(1)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleStart(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFeedback(null)
    try {
      const qs = await startInterview({ target_role: role, experience_years: years })
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(''))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleFeedback() {
    setLoading(true)
    setError(null)
    try {
      const payload = questions.map((q, idx) => ({
        question_id: q.id,
        answer: answers[idx],
      }))
      const fb = await getInterviewFeedback(payload)
      setFeedback(fb)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Mock Interview</h2>
      <form onSubmit={handleStart} className="vm-form">
        <label className="vm-field">
          <span>Target role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <label className="vm-field">
          <span>Years of experience</span>
          <input
            type="number"
            min={0}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading} className="vm-button">
          {loading ? 'Preparing…' : 'Start Interview'}
        </button>
      </form>
      {error && <p className="vm-error">{error}</p>}
      {questions.length > 0 && (
        <div className="vm-card">
          <ol>
            {questions.map((q, qi) => (
              <li key={q.id}>
                <p>{q.question}</p>
                {q.hint && <p className="vm-hint">Hint: {q.hint}</p>}
                <textarea
                  value={answers[qi] ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => {
                      const next = [...prev]
                      next[qi] = e.target.value
                      return next
                    })
                  }
                />
              </li>
            ))}
          </ol>
          <button onClick={handleFeedback} disabled={loading} className="vm-button">
            {loading ? 'Analyzing…' : 'Get Feedback'}
          </button>
        </div>
      )}
      {feedback && (
        <div className="vm-card">
          <h3>Interview Score: {feedback.score}/10</h3>
          <h4>Strengths</h4>
          <ul>{feedback.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
          <h4>Improvements</h4>
          <ul>{feedback.improvements.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
    </section>
  )
}

function JobsPage() {
  const [role, setRole] = useState('Data Analyst')
  const [location, setLocation] = useState('Remote')
  const [jobs, setJobs] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await fetchJobs({ target_role: role, location_preference: location })
      setJobs(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Job Recommendations</h2>
      <form onSubmit={handleSubmit} className="vm-form">
        <label className="vm-field">
          <span>Target role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <label className="vm-field">
          <span>Location preference</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <button type="submit" disabled={loading} className="vm-button">
          {loading ? 'Searching…' : 'Get Recommendations'}
        </button>
      </form>
      {error && <p className="vm-error">{error}</p>}
      {jobs.length > 0 && (
        <div className="vm-card">
          <ul>
            {jobs.map((job) => (
              <li key={`${job.company}-${job.title}`}>
                <strong>{job.title}</strong> at {job.company} – {job.location} (match {job.match_score}
                %)
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function ProgressPage() {
  const [data, setData] = useState<ProgressResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLoad() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchProgress()
      setData(res)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Progress Tracking</h2>
      <button onClick={handleLoad} disabled={loading} className="vm-button">
        {loading ? 'Loading…' : 'Refresh Progress'}
      </button>
      {error && <p className="vm-error">{error}</p>}
      {data && (
        <div className="vm-card">
          <ul>
            {data.items.map((item) => (
              <li key={item.module}>
                <strong>{item.module}</strong>: {item.completed}/{item.total} completed
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default App
