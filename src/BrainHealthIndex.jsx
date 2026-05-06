import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FluentProvider, Button } from '@fluentui/react-components'
import { Brain, X, ArrowRight, ChevronLeft } from 'lucide-react'
import BHIReportContent from './components/BHIReportContent'
import { getCompleteAssessmentUrl, primeCompleteAssessmentUrl } from './lib/completeAssessmentUrl'
import { useAuthIdentity } from './lib/useAuthIdentity'
import { persistDashboardAssessment } from './lib/persistDashboardAssessment.js'

// ---- Dr. Nasir Brain Wellness Quiz questions ----
const NASIR_SCALE = ['Not at all', 'A little', 'Somewhat', 'Often', 'Almost always']
const ENDURANCE_SCALE = ['Hours', '60 mins', '30 mins', '10 mins', 'Almost immediately']

const NASIR_QUESTIONS = [
  { id: 'persona',  type: 'choice',    domain: 'Getting started',       text: 'Who are you taking this quiz for?', options: ['Myself', 'A loved one'] },
  { id: 'name',     type: 'text',      domain: 'About your loved one',  text: "What is your loved one's first name?", textSelf: 'What is your first name?', domainSelf: 'About you', placeholder: 'First name' },
  { id: 'age',      type: 'number',    domain: 'About your loved one',  text: 'How old are they?',                   textSelf: 'How old are you?',           domainSelf: 'About you', placeholder: 'Age' },
  { id: 'relation', type: 'choice',    domain: 'About your loved one',  text: 'What is your relationship to them?', options: ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other'], skipForSelf: true },
  { id: 'q1',  type: 'scale', domain: "How {name}'s Brain Feels", domainSelf: 'How Your Brain Feels', text: 'How often does {name} seem foggy, slowed down, or "not as sharp" as usual?',                              textSelf: 'How often do you feel foggy, slowed down, or "not as sharp" as usual?' },
  { id: 'q2',  type: 'scale', domain: "How {name}'s Brain Feels", domainSelf: 'How Your Brain Feels', text: 'How often does low energy make it harder for {name} to think or function?',                              textSelf: 'How often does low energy make it harder for you to think or function?' },
  { id: 'q3',  type: 'scale', domain: "How {name}'s Brain Feels", domainSelf: 'How Your Brain Feels', text: 'How often does {name} experience head pressure, tightness, or headaches?',                               textSelf: 'How often do you experience head pressure, tightness, or headaches?' },
  { id: 'q4',  type: 'scale', domain: "How {name}'s Brain Feels", domainSelf: 'How Your Brain Feels', text: 'How often does {name} struggle to stay focused or get easily distracted?',                               textSelf: 'How often do you struggle to stay focused or get easily distracted?' },
  { id: 'q5',  type: 'scale', domain: "How {name}'s Brain Feels", domainSelf: 'How Your Brain Feels', text: 'How often does {name} seem scattered, overwhelmed, or disorganised?',                                    textSelf: 'How often do you feel scattered, overwhelmed, or disorganised?' },
  { id: 'q6',  type: 'scale', domain: 'Stress, Mood & Autonomic',                                     text: 'How often does {name} seem keyed-up, tense, or on edge?',                                                textSelf: 'How often do you feel keyed-up, tense, or on edge?' },
  { id: 'q7',  type: 'scale', domain: 'Stress, Mood & Autonomic',                                     text: 'How often does {name} experience palpitations, sudden dips in energy, dizziness, heat intolerance, or shakiness?', textSelf: 'How often do you experience palpitations, sudden dips in energy, dizziness, heat intolerance, or shakiness?' },
  { id: 'q8',  type: 'scale', domain: 'Stress, Mood & Autonomic',                                     text: "How often is {name}'s sleep light, unrefreshing, or disrupted?",                                         textSelf: 'How often is your sleep light, unrefreshing, or disrupted?' },
  { id: 'q9',  type: 'scale', domain: 'Balance & Sensory',                                             text: 'Does {name} get dizzy, off-balance, or sensitive to busy environments or fast movements?',               textSelf: 'Do you get dizzy, off-balance, or sensitive to busy environments or fast movements?' },
  { id: 'q10', type: 'scale', domain: 'Balance & Sensory',                                             text: 'How often does {name} have trouble finding words, remembering names, or recalling information quickly?',  textSelf: 'How often do you have trouble finding words, remembering names, or recalling information quickly?' },
  { id: 'q11', type: 'scale',     domain: 'Optional -- Fine-Tune the Profile', text: "Do {name}'s symptoms get worse after mental or physical activity?",               textSelf: 'Do your symptoms get worse after mental or physical activity?',                          optional: true },
  { id: 'q12', type: 'scale',     domain: 'Optional -- Fine-Tune the Profile', text: 'Is {name} sensitive to noise, screens, bright lights, or crowded spaces?',         textSelf: 'Are you sensitive to noise, screens, bright lights, or crowded spaces?',                  optional: true },
  { id: 'q13', type: 'endurance', domain: 'Optional -- Fine-Tune the Profile', text: 'How long can {name} stay mentally sharp before performance drops?',                textSelf: 'How long can you stay mentally sharp before your performance drops?',                    optional: true },
  { id: 'q14', type: 'scale',     domain: 'Optional -- Fine-Tune the Profile', text: 'Does {name} seem more emotionally reactive or less steady than usual?',             textSelf: 'Do you seem more emotionally reactive or less steady than usual?' },
]

const ANALYZING_STEPS = [
  'Reviewing symptom patterns...',
  'Mapping to neurological clusters...',
  'Identifying your phenotype...',
  'Preparing your report...',
]

function clusterAvg(answers, ids) {
  const vals = ids.map(id => answers[id]).filter(v => v != null && !isNaN(v))
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function computeResults(answers) {
  const lovedOneName = (typeof answers.name === 'string' ? answers.name : 'Your loved one').trim() || 'Your loved one'
  const lovedOneAge = answers.age || null
  const relationOptions = ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other']
  const caregiverRelation = answers.relation ? (relationOptions[answers.relation - 1] || '') : ''

  const nif  = clusterAvg(answers, ['q1', 'q2', 'q3', 'q11', 'q12'])
  const cog  = clusterAvg(answers, ['q4', 'q5', 'q10', 'q13'])
  const aux  = clusterAvg(answers, ['q6', 'q7', 'q8', 'q14'])
  const vest = clusterAvg(answers, ['q9', 'q12'])

  const allIds = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14']
  const gsi = clusterAvg(answers, allIds)
  const highItems = allIds.filter(id => answers[id] != null && answers[id] >= 3).length

  let phenotype
  if (gsi >= 2.5 && highItems >= 4 && (cog >= 3 || nif >= 3 || vest >= 3)) {
    phenotype = 'severe'
  } else if (nif < 2.5 && cog < 2.5 && aux < 2.5 && vest < 2.5) {
    phenotype = 'longevity'
  } else {
    const clusters = { nif, cog, aux, vest }
    const primary = Object.entries(clusters).reduce((a, b) => b[1] > a[1] ? b : a)[0]
    phenotype = (primary === 'nif' || primary === 'vest') ? 'neuroinflammatory'
              : primary === 'cog' ? 'cognitive'
              : 'autonomic'
  }

  return { lovedOneName, lovedOneAge, caregiverRelation, phenotype, nif, cog, aux, vest, gsi }
}

// ---- Fluent 2 theme — uses :root tokens from docs/cogcare-design-system/colors_and_type.css ----
const cogcareTheme = {
  colorBrandBackground: 'var(--color-forest)',
  colorBrandBackgroundHover: 'var(--color-forest-dark)',
  colorBrandBackgroundPressed: 'var(--color-forest-dark)',
  colorBrandForeground1: 'var(--color-forest)',
  colorNeutralForegroundOnBrand: '#FFFFFF',
  colorNeutralBackground1: 'var(--color-bg)',
  colorNeutralBackground2: 'var(--color-surface)',
  colorNeutralBackground3: 'var(--color-surface)',
  colorNeutralStroke1: 'var(--color-border)',
  colorNeutralStroke2: 'var(--color-border)',
  colorNeutralForeground1: 'var(--color-ink)',
  colorNeutralForeground2: 'var(--color-forest)',
  borderRadiusMedium: '12px',
  borderRadiusLarge: '16px',
  borderRadiusXLarge: '24px',
}

// ---- BHIQuiz ----
function BHIQuiz({ quizAnswers, setQuizAnswers, onComplete, excludedQuestionIds = [] }) {
  const isSelf = quizAnswers.persona === 1
  const questions = NASIR_QUESTIONS.filter((item) => !excludedQuestionIds.includes(item.id) && !(isSelf && item.skipForSelf))
  const [qi, setQi] = useState(0)
  const total = questions.length
  const q = questions[qi]
  const pct = (qi + 1) / total
  const name = (typeof quizAnswers.name === 'string' && quizAnswers.name.trim()) || (isSelf ? 'you' : 'your loved one')
  const domainText = (isSelf && q.domainSelf) ? q.domainSelf : q.domain.replace(/\{name\}/g, name)
  const questionText = (isSelf && q.textSelf) ? q.textSelf : q.text.replace(/\{name\}/g, name)
  const currentValue = quizAnswers[q.id]

  const canProceed = (() => {
    if (q.type === 'text') return typeof currentValue === 'string' && currentValue.trim().length > 0
    if (q.type === 'number') return typeof currentValue === 'number' && currentValue > 0 && currentValue < 130
    if (q.optional) return true
    return currentValue != null
  })()

  const setAnswer = (val) => setQuizAnswers(prev => ({ ...prev, [q.id]: val }))

  const handleNext = () => {
    if (!canProceed) return
    if (qi < total - 1) {
      setQi(qi + 1)
    } else {
      onComplete(computeResults(quizAnswers))
    }
  }

  const handleBack = () => {
    if (qi > 0) setQi(qi - 1)
  }

  const handleSkip = () => {
    const updated = { ...quizAnswers, [q.id]: null }
    setAnswer(null)
    if (qi < total - 1) {
      setQi(qi + 1)
    } else {
      onComplete(computeResults(updated))
    }
  }

  const options = (() => {
    if (q.type === 'scale') return NASIR_SCALE
    if (q.type === 'endurance') return ENDURANCE_SCALE
    return q.options || []
  })()

  return (
    <div className="flex h-full flex-col">
      {/* Progress + domain */}
      <div className="shrink-0 border-b border-border/80 bg-page px-4 pb-3 pt-3 sm:px-8 sm:pb-4 sm:pt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-clay ring-1 ring-border/60">
            {domainText}
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-forest/80">
            Question <span className="text-forest">{qi + 1}</span>
            <span className="mx-1 font-normal text-forest/40">/</span>
            {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/90">
          <div className="h-full rounded-full bg-forest transition-[width] duration-500 ease-out" style={{ width: `${Math.min(100, pct * 100)}%` }} />
        </div>
      </div>

      {/* Question + input */}
      <div className="flex flex-1 min-h-0 flex-col px-4 py-4 sm:px-8 sm:py-5">
        <p className="mb-1.5 shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] text-forest/40">
          {domainText}
        </p>
        <h2 className="mb-4 shrink-0 font-serif text-[1.1rem] leading-snug tracking-tight text-ink sm:text-xl">
          {questionText}
        </h2>

        {/* Text input */}
        {q.type === 'text' && (
          <input
            type="text"
            value={currentValue || ''}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && canProceed) handleNext() }}
            placeholder={q.placeholder}
            autoFocus
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-ink-faint focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        )}

        {/* Number input */}
        {q.type === 'number' && (
          <input
            type="number"
            value={currentValue || ''}
            onChange={e => setAnswer(Number(e.target.value))}
            onKeyDown={e => { if (e.key === 'Enter' && canProceed) handleNext() }}
            placeholder={q.placeholder}
            min={1}
            max={120}
            autoFocus
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-ink-faint focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        )}

        {/* Choice / scale / endurance buttons */}
        {(q.type === 'choice' || q.type === 'scale' || q.type === 'endurance') && (
          <fieldset className="min-h-0 min-w-0 flex-1 border-0 p-0">
            <legend className="sr-only">Choose one answer</legend>
            <div className="flex h-full flex-col justify-between gap-2">
              {options.map((label, i) => {
                const value = (q.type === 'scale' || q.type === 'endurance') ? i : i + 1
                const isOn = currentValue === value
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setAnswer(value)}
                    className={[
                      'group flex w-full flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-200',
                      isOn
                        ? 'border-forest bg-surface ring-2 ring-forest/15'
                        : 'border-border bg-white hover:border-clay/45 hover:bg-page active:scale-[0.99]',
                    ].join(' ')}
                  >
                    {(q.type === 'scale' || q.type === 'endurance') && (
                      <span className={['flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums', isOn ? 'bg-forest text-white' : 'bg-surface text-forest group-hover:bg-border/80'].join(' ')} aria-hidden>
                        {value}
                      </span>
                    )}
                    <span className={['min-w-0 flex-1 text-[13px] font-medium leading-snug', isOn ? 'text-ink' : 'text-forest'].join(' ')}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}
      </div>

      {/* Navigation */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface/50 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4">
        {qi > 0 ? (
          <Button
            appearance="subtle"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={handleBack}
          >
            Back
          </Button>
        ) : (
          <div className="min-w-[4rem]" aria-hidden />
        )}
        {q.optional && (
          <Button appearance="subtle" onClick={handleSkip} className="text-clay">
            Skip
          </Button>
        )}
        <Button
          appearance="primary"
          disabled={!canProceed}
          onClick={handleNext}
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="after"
          className={!canProceed ? 'opacity-50' : ''}
        >
          {qi < total - 1 ? 'Next' : 'View results'}
        </Button>
      </div>
    </div>
  )
}

/**
 * Legacy email-only path when `VITE_COMPLETE_ASSESSMENT_URL` is unset: no Cognito onboarding or
 * “existing account” dashboard linking — use the Lambda URL for full quiz completion behavior.
 * In dev, Vite serves POST /api/send-quiz-email (see vite-plugin-local-email-api.js).
 */
const LEGACY_QUIZ_EMAIL_URL =
  import.meta.env.VITE_QUIZ_EMAIL_API_URL ||
  (import.meta.env.DEV ? '/api/send-quiz-email' : '')

// ---- BHIReport ----
function BHIReport({
  quizResults,
  onReset,
  quizAnswers,
  onClose,
  dashboardNotice,
  dashboardSaveError,
}) {
  const navigate = useNavigate()
  const authIdentity = useAuthIdentity()
  const [consultEmailHint, setConsultEmailHint] = useState('')
  const [fnUrl, setFnUrl] = useState(() => getCompleteAssessmentUrl())
  useEffect(() => {
    let alive = true
    void primeCompleteAssessmentUrl().then(() => {
      if (alive) setFnUrl(getCompleteAssessmentUrl())
    })
    return () => {
      alive = false
    }
  }, [])
  const completeAssessmentUrl = fnUrl
  const canEmail = Boolean(completeAssessmentUrl || LEGACY_QUIZ_EMAIL_URL)

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState('idle')
  const [emailMessage, setEmailMessage] = useState('')
  /** After successful Lambda submit: `new_user` | `existing_user` (legacy API omits). */
  const [emailScenario, setEmailScenario] = useState(null)
  const [existingAccountModalOpen, setExistingAccountModalOpen] = useState(false)

  const sendResultsEmail = async () => {
    if (!canEmail) return
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailMessage('Please enter a valid email address.')
      setEmailStatus('error')
      return
    }
    setEmailStatus('sending')
    setEmailMessage('')
    try {
      await primeCompleteAssessmentUrl()
      const resolvedFnUrl = getCompleteAssessmentUrl()
      const url = resolvedFnUrl || LEGACY_QUIZ_EMAIL_URL
      const body = resolvedFnUrl
        ? JSON.stringify({
            email: trimmed,
            results: quizResults,
            answers: quizAnswers ?? {},
          })
        : JSON.stringify({ email: trimmed, results: quizResults })
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body,
      })
      const text = await res.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = {}
      }
      if (!res.ok) {
        const serverMsg =
          (typeof data.error === 'string' && data.error) ||
          (typeof data.message === 'string' && data.message) ||
          (text && text.length < 400 ? text.trim() : '')
        throw new Error(serverMsg || `Request failed (${res.status})`)
      }
      const scenario =
        typeof data.scenario === 'string' ? data.scenario : 'new_user'
      setEmailScenario(scenario)
      setEmailStatus('sent')
      setEmailMessage('')
      if (resolvedFnUrl && scenario === 'existing_user') {
        setExistingAccountModalOpen(true)
        return
      }
    } catch (err) {
      setEmailStatus('error')
      let msg = err instanceof Error ? err.message : 'Could not send email.'
      if (msg === 'Failed to fetch' || msg === 'Load failed' || msg === 'NetworkError when attempting to fetch resource.') {
        msg =
          'Could not reach the email service. Try another network or browser, disable blockers, then confirm Amplify: backend deployed, Brevo secrets set, and Hosting env VITE_COMPLETE_ASSESSMENT_URL or build output runtime-email-config.json includes your Lambda Function URL.'
      }
      setEmailMessage(msg)
    }
  }

  const returnToEnc = encodeURIComponent('/dashboard')
  const encEmail = encodeURIComponent(email.trim())
  /** quizFlow=existing skips the “temporary password” hint on LoginPage. */
  const signInQuizUrl = `/login?from=quiz&quizFlow=existing&returnTo=${returnToEnc}&prefillEmail=${encEmail}`

  const handleConsultClick = () => {
    window.open('https://calendly.com/cogcare/30min', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col h-full">
      {existingAccountModalOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 p-4 sm:items-center"
          role="presentation"
          onClick={() => setExistingAccountModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bhi-existing-account-title"
            className="w-full max-w-md rounded-2xl border border-border bg-page p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="bhi-existing-account-title"
              className="font-serif text-xl italic text-forest"
            >
              You already have an account
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-forest/90">
              This email is registered with CogCare. We added this quiz to your dashboard and emailed
              you your report.
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-forest">
              Check your email for a magic link—or, if you remember your password, sign in.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-forest px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-forest-dark"
                onClick={() => {
                  setExistingAccountModalOpen(false)
                  onClose?.()
                  navigate(signInQuizUrl)
                }}
              >
                Sign in
              </button>
            </div>
            <button
              type="button"
              className="mt-4 w-full text-center text-sm text-clay underline-offset-4 hover:underline"
              onClick={() => setExistingAccountModalOpen(false)}
            >
              Not now
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-clay sr-only">
          Assessment Complete
        </p>
        {dashboardNotice ? (
          <div
            className="mb-4 rounded-xl border border-emerald-200/90 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950"
            role="status"
          >
            {dashboardNotice}
          </div>
        ) : null}
        {dashboardSaveError ? (
          <div
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            {dashboardSaveError}
          </div>
        ) : null}
        <BHIReportContent
          quizResults={quizResults}
          email={email}
          setEmail={setEmail}
          emailStatus={emailStatus}
          emailMessage={emailMessage}
          onSendEmail={sendResultsEmail}
          canEmail={canEmail}
          emailScenario={emailScenario}
          onResetEmail={() => {
            setEmailStatus('idle')
            setEmailScenario(null)
            setEmailMessage('')
            setConsultEmailHint('')
          }}
          onConsultClick={handleConsultClick}
          consultEmailHint={consultEmailHint}
          onSendGuideEmail={async (guideEmailAddr) => {
            const url = getCompleteAssessmentUrl() || LEGACY_QUIZ_EMAIL_URL
            if (!url) return
            await fetch(url, {
              method: 'POST',
              mode: 'cors',
              credentials: 'omit',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ email: guideEmailAddr, type: 'caregiver_guide' }),
            })
          }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-surface px-4 py-5 sm:px-8 sm:py-6">
        <p className="mb-4 text-[11px] leading-relaxed text-forest opacity-60">
          This is not a clinical diagnosis. Please consult a qualified healthcare professional.
        </p>
        <Button appearance="outline" onClick={onReset}>
          Start Over
        </Button>
      </div>
    </div>
  )
}

// ---- BrainHealthIndex overlay shell ----
export default function BrainHealthIndex({
  open,
  onClose,
  quizAnswers,
  setQuizAnswers,
  quizResults,
  setQuizResults,
  /** Question `id`s from CAREGIVER_QUESTIONS to omit (e.g. name/age/relation for an existing subject). */
  excludedQuestionIds = [],
  /** Merged into quiz answers when resetting “Start over”. */
  quizAnswersDefaults = {},
  /** When set, saves assessment + updates brain credit after analysis (signed-in dashboard). */
  persistToDashboard = null,
  onDashboardPersisted = undefined,
}) {
  // ESC to close + body scroll lock
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const [analyzing, setAnalyzing] = useState(false)
  const [analyzingStep, setAnalyzingStep] = useState(0)
  const pendingResults = useRef(null)
  const analyzingInterval = useRef(null)
  const [dashboardNotice, setDashboardNotice] = useState(null)
  const [dashboardSaveError, setDashboardSaveError] = useState(null)
  const quizAnswersDefaultsRef = useRef(quizAnswersDefaults)

  useEffect(() => {
    quizAnswersDefaultsRef.current = quizAnswersDefaults
  }, [quizAnswersDefaults])

  useEffect(() => {
    if (!open) return
    setDashboardNotice(null)
    setDashboardSaveError(null)
  }, [open])

  useEffect(() => {
    if (open) return
    clearInterval(analyzingInterval.current)
    setAnalyzing(false)
    setAnalyzingStep(0)
    pendingResults.current = null
  }, [open])

  const handleComplete = useCallback(
    (results) => {
      pendingResults.current = results
      setAnalyzing(true)
      setAnalyzingStep(0)
      let step = 0
      analyzingInterval.current = setInterval(() => {
        step++
        if (step >= ANALYZING_STEPS.length) {
          clearInterval(analyzingInterval.current)
          setTimeout(async () => {
            if (persistToDashboard?.ownerSub) {
              try {
                const info = await persistDashboardAssessment({
                  client: persistToDashboard.client,
                  ownerSub: persistToDashboard.ownerSub,
                  answers: quizAnswers ?? {},
                  results: pendingResults.current,
                  existingSubjectId: persistToDashboard.existingSubjectId ?? null,
                })
                setDashboardNotice('This assessment is saved to your dashboard.')
                setDashboardSaveError(null)
                onDashboardPersisted?.(info)
              } catch (err) {
                const msg =
                  err instanceof Error ? err.message : 'Could not save to your dashboard.'
                setDashboardSaveError(msg)
                if (import.meta.env.DEV) console.error('[dashboard persist]', err)
              }
            }
            setAnalyzing(false)
            setQuizResults(pendingResults.current)
          }, 600)
        } else {
          setAnalyzingStep(step)
        }
      }, 650)
    },
    [
      persistToDashboard,
      quizAnswers,
      setQuizResults,
      onDashboardPersisted,
    ],
  )

  const handleReset = useCallback(() => {
    clearInterval(analyzingInterval.current)
    setAnalyzing(false)
    setAnalyzingStep(0)
    pendingResults.current = null
    setQuizAnswers({ ...quizAnswersDefaultsRef.current })
    setQuizResults(null)
    setDashboardNotice(null)
    setDashboardSaveError(null)
  }, [setQuizAnswers, setQuizResults])

  const step = analyzing ? 'analyzing' : quizResults ? 'report' : 'quiz'

  if (!open) return null

  return (
    <FluentProvider theme={cogcareTheme}>
      <div
        className="fixed inset-0 z-[60] flex min-h-0 flex-col overflow-hidden sm:flex-row"
        style={{
          /* Full-bleed scrim so safe-area padding is not transparent (avoids site header showing above the modal). */
          backgroundColor: 'rgba(61,75,62,0.5)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
      {/* Dimmed backdrop — click to close */}
      <div
        role="button"
        tabIndex={0}
        className="min-h-0 flex-1 animate-modal-backdrop cursor-pointer sm:min-h-0"
        style={{ background: 'rgba(61,75,62,0.5)' }}
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose() }}
        aria-label="Close assessment"
      />

      {/* Slide-in panel — full width on small screens; max-h-full keeps sheet within the padded viewport (min-h-[25%] + 85dvh could overflow on short phones). */}
      <div
        className="animate-modal-panel flex min-h-0 max-h-full w-full max-w-none flex-col border-t border-border bg-page shadow-brand-lg sm:max-h-none sm:h-full sm:w-[58vw] sm:max-w-[700px] sm:min-w-[min(100%,320px)] sm:border-l sm:border-t-0 sm:shadow-brand-xl"
      >
        {/* Panel header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <Brain className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.5} aria-hidden="true" />
            <span className="truncate font-serif text-base italic text-forest sm:text-lg">
              Brain Health Index
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-forest transition-colors hover:bg-surface"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 'quiz' && (
            <BHIQuiz
              key={excludedQuestionIds.length ? excludedQuestionIds.join('|') : 'all-questions'}
              quizAnswers={quizAnswers}
              setQuizAnswers={setQuizAnswers}
              onComplete={handleComplete}
              excludedQuestionIds={excludedQuestionIds}
            />
          )}
          {step === 'analyzing' && (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#F3EFE9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'bhi-pulse 1.4s ease-in-out infinite',
                }}>
                  <Brain className="h-[18px] w-[18px] text-clay" strokeWidth={1.5} />
                </div>
              </div>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.2rem', fontStyle: 'italic', color: '#3D4B3E',
                marginBottom: 10, textAlign: 'center',
              }}>
                Analysing your responses
              </p>
              <p style={{
                fontSize: 13, color: '#A67B5B', fontWeight: 600,
                letterSpacing: '0.05em', minHeight: 20, textAlign: 'center',
                transition: 'opacity 0.3s',
              }}>
                {ANALYZING_STEPS[analyzingStep]}
              </p>
            </div>
          )}
          {step === 'report' && quizResults && (
            <BHIReport
              quizResults={quizResults}
              quizAnswers={quizAnswers}
              onReset={handleReset}
              onClose={onClose}
              dashboardNotice={dashboardNotice}
              dashboardSaveError={dashboardSaveError}
            />
          )}
        </div>
      </div>
      </div>
    </FluentProvider>
  )
}

