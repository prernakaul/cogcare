import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
import BrainHealthIndex from '../BrainHealthIndex'
import { useAuthIdentity } from '../lib/useAuthIdentity'
import CogcareHome from '../components/cogcare-home/CogcareHome.jsx'
import { X, ArrowRight, ArrowUpRight, Brain, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const authIdentity = useAuthIdentity()
  const [showQuiz, setShowQuiz] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const closeBtnRef = useRef(null)

  const cards = [
    {
      id: 'assessment',
      category: 'Assessment',
      title: 'Know Your Brain Health Score',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      content: 'The Brain Health Index is a clinically grounded, 5-minute screening tool developed by physicians from UCLA, Mayo Clinic, and Harvard. It evaluates memory, processing speed, and executive function across 12 validated domains.',
    },
    {
      id: 'prevention',
      category: 'Prevention',
      title: 'Modify What Can Be Modified',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      content: 'Forty percent of dementia risk is attributable to modifiable lifestyle factors. Sleep quality, cardiovascular fitness, social engagement, and diet each play measurable roles. CogCare translates research into daily, actionable rituals.',
    },
    {
      id: 'specialists',
      category: 'Specialists',
      title: 'First-Priority Access to Leading Physicians',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
      content: 'Our network of neurologists and geriatric psychiatrists trained at the nation\'s top institutions. CogCare members receive priority scheduling — often within days — with specialists whose waitlists typically run months.',
    },
    {
      id: 'education',
      category: 'Education',
      title: 'Science Made Accessible',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      content: 'From the latest Lancet Commission findings to practical caregiver guides, our education portal translates cutting-edge neuroscience into language every family can act on. No medical training required.',
    },
  ]

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const handleCloseQuiz = useCallback(() => setShowQuiz(false), [])
  const closeIntroRef = useRef(null)

  useEffect(() => {
    if (searchParams.get('startQuiz') !== 'newSubject') return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open quiz modal when landing with ?startQuiz=newSubject from dashboard
    setShowQuiz(true)
    const next = new URLSearchParams(searchParams)
    next.delete('startQuiz')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!showIntro) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowIntro(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeIntroRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [showIntro])

  const startAssessment = useCallback(() => {
    setShowIntro(true)
  }, [])

  return (
    <div className="min-h-screen bg-page text-ink font-sans selection:bg-border">
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 pt-[max(0.5rem,env(safe-area-inset-top))] ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md py-3 sm:py-4 shadow-sm'
            : 'bg-transparent py-4 sm:py-6 md:py-8'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 md:gap-6">
          <a
            href={`${BASE}/`}
            className="group flex min-w-0 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap sm:gap-2.5"
          >
            <Brain
              className="h-5 w-5 shrink-0 text-clay transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:h-7"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="font-serif text-xl tracking-tighter text-forest whitespace-nowrap sm:text-2xl md:text-3xl">
              Cog<span className="italic">Care</span>
              <span className="ml-0.5 font-sans text-sm font-medium tracking-normal text-clay opacity-80 sm:text-base">
                .org
              </span>
            </span>
          </a>

          <nav
            className="flex shrink-0 flex-nowrap items-center justify-end gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-forest sm:gap-4 sm:text-[10px] sm:tracking-[0.2em] md:gap-8"
            aria-label="Primary"
          >
            <a
              href="https://cogcare.org/"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 transition-opacity hover:opacity-60"
              rel="noopener noreferrer"
            >
              Education
            </a>
            <a
              href="https://cogcare.org/blog/"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 transition-opacity hover:opacity-60"
              rel="noopener noreferrer"
            >
              Blog
            </a>
            {authIdentity === 'signedIn' ? (
              <Link
                to="/dashboard"
                className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 transition-opacity hover:opacity-60"
              >
                My dashboard
              </Link>
            ) : authIdentity === 'loading' ? (
              <span className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 text-forest/50">
                …
              </span>
            ) : (
              <Link
                to="/login"
                className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 transition-opacity hover:opacity-60"
              >
                Get Inside
              </Link>
            )}
            <a
              href="https://cogcare.org/"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full bg-forest px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-forest-dark sm:px-6 sm:py-2.5 sm:text-[10px] sm:tracking-[0.2em] md:px-10 md:py-3.5"
              rel="noopener noreferrer"
            >
              Donate
            </a>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[100dvh] items-center overflow-hidden pt-[max(5.5rem,env(safe-area-inset-top))] sm:pt-28">
        <div className="max-w-7xl mx-auto w-full grid items-center gap-8 px-4 sm:px-6 md:grid-cols-12 lg:gap-24">
          <div className="z-10 pt-8 sm:pt-12 md:col-span-7 lg:pt-24">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-surface px-2.5 py-1.5 text-[8px] font-bold uppercase leading-tight tracking-[0.2em] text-clay sm:mb-8 sm:px-3 sm:text-[9px] sm:tracking-[0.25em]">
              <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
              <span className="min-w-0">
                Evidence-Based Cognitive Wellness
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-serif leading-[1.05] tracking-tight text-ink sm:mb-8 sm:text-5xl md:mb-10 md:text-6xl lg:text-8xl lg:leading-[1.05]">
              Dementia is <br />
              <span className="italic text-forest">Modifiable.</span>
            </h1>

            <p className="mb-8 max-w-xl text-base font-light leading-relaxed text-ink-muted sm:mb-10 sm:text-lg md:text-xl lg:text-2xl">
              Scientific breakthroughs reveal that 40% of dementia risk is linked
              to factors we can change. Your protective journey begins with daily
              rituals.
            </p>

            <div className="w-full max-w-sm rounded-[2rem] border border-surface bg-white/40 p-5 shadow-sm backdrop-blur-md sm:rounded-[2.5rem] sm:p-6 lg:max-w-md lg:rounded-[3rem] lg:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint mb-6">
                Start your BRAIN check-in
              </p>
              <button
                type="button"
                onClick={() => setShowIntro(true)}
                className="w-full bg-forest text-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Begin Assessment
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="relative mt-10 flex justify-center md:col-span-5 md:mt-0">
            <div className="relative aspect-[4/5] w-full max-w-[min(100%,20rem)] overflow-hidden rounded-[2.25rem] border-[8px] border-white shadow-brand-2xl ring-1 ring-border sm:max-w-sm sm:rounded-[3rem] sm:border-[12px] lg:max-w-lg lg:rounded-[4.5rem] lg:border-[16px]">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=900"
                alt="Portrait representing cognitive resilience and well-being"
                className="h-full w-full object-cover grayscale-[0.05]"
                width={900}
                height={1125}
                decoding="async"
              />
              <div className="absolute inset-0 bg-forest/5 mix-blend-multiply" />
            </div>

            <div className="absolute -bottom-8 -left-8 lg:-bottom-10 lg:-left-10 bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl max-w-[180px] lg:max-w-[220px] hidden md:block border border-surface transform -rotate-3 hover:rotate-0 transition-all duration-700">
              <p className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.25em] text-clay mb-2 lg:mb-3">
                Key Discovery
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl font-serif text-forest">
                  40
                </span>
                <span className="text-lg lg:text-xl font-serif text-forest italic">
                  %
                </span>
              </div>
              <p className="text-[9px] lg:text-[10px] leading-relaxed text-ink-faint font-medium mt-2 lg:mt-3 italic">
                of cases preventable through modification.
              </p>
            </div>
          </div>

          <p className="md:col-span-12 mt-10 w-full text-center text-base font-light leading-[1.65] text-ink-muted sm:mt-12 sm:text-lg md:mt-14 md:text-xl md:leading-relaxed lg:text-[1.35rem] lg:leading-[1.7]">
            CogCare is a nonprofit devoted to brain health. Our physicians—trained
            at UCLA, Mayo Clinic, Penn, Harvard, and other leading institutions—came
            together to develop a new approach to brain assessment.
          </p>
        </div>
      </section>

      <section
        className="bg-white py-16 sm:py-24 md:py-32"
        aria-labelledby="pillars-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 grid items-end gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2
                id="pillars-heading"
                className="mb-6 text-3xl font-serif leading-tight text-ink sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Dementia Does Not <br />
                <span className="italic text-forest">Differentiate.</span>
              </h2>
              <p className="max-w-lg text-base font-light leading-relaxed text-ink-faint sm:text-lg md:text-xl">
                High-end cognitive care should be a universal standard. We build
                the inclusive architecture for brain health across all
                communities.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <div className="h-px w-full lg:w-48 bg-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className="group relative h-[min(78vh,520px)] w-full cursor-pointer overflow-hidden rounded-[2rem] border-0 bg-surface p-0 text-left transition-all duration-700 hover:shadow-2xl sm:h-[540px] sm:rounded-[3rem] md:h-[580px] lg:rounded-[3.5rem]"
              >
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />

                <div className="absolute bottom-0 left-0 w-full transform p-6 text-white transition-transform duration-700 sm:p-10">
                  <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.25em] text-white/60 sm:mb-4 sm:text-[9px] sm:tracking-[0.3em]">
                    {card.category}
                  </p>
                  <h3 className="mb-4 max-w-[220px] font-serif text-xl leading-tight sm:mb-8 sm:text-2xl">
                    {card.title}
                  </h3>
                  <div className="flex translate-y-2 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-100 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    Explore
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-end sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            className="animate-modal-backdrop absolute inset-0 cursor-pointer border-0 bg-forest/20 p-0 backdrop-blur-md"
            onClick={() => setSelectedCard(null)}
            aria-label="Close panel"
          />
          <div
            className="animate-modal-panel relative flex h-[92dvh] max-h-[100dvh] w-full max-w-2xl flex-col overflow-y-auto bg-page shadow-2xl sm:h-full sm:max-h-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-detail-title"
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-border bg-white p-3 transition-all hover:bg-surface sm:right-10 sm:top-10 sm:p-4"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-ink" aria-hidden />
            </button>

            <div className="px-5 pb-16 pt-24 sm:px-10 sm:pb-24 sm:pt-32 md:px-20">
              <div className="inline-block px-4 py-1.5 bg-forest text-white text-[9px] font-bold uppercase tracking-[0.25em] mb-12 rounded-full">
                {selectedCard.category}
              </div>
              <h2
                id="card-detail-title"
                className="mb-10 font-serif text-3xl italic leading-[1.15] text-ink sm:mb-12 sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl"
              >
                {selectedCard.title}
              </h2>

              <div className="mb-10 aspect-[16/10] overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-2xl sm:mb-12 sm:rounded-[2.5rem] sm:border-[10px] md:mb-16 md:rounded-[3.5rem] md:border-[12px]">
                <img
                  src={selectedCard.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div className="max-w-none">
                <p className="mb-10 whitespace-pre-line border-l-2 border-clay pl-5 text-base font-light italic leading-relaxed text-ink-muted sm:mb-12 sm:pl-8 sm:text-lg md:mb-16 md:text-xl lg:text-2xl">
                  {selectedCard.content}
                </p>

                <div className="space-y-6">
                  <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-forest sm:mb-8">
                    Next Steps
                  </p>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between rounded-2xl border border-border bg-white p-5 text-left shadow-sm transition-all hover:border-forest hover:shadow-xl sm:rounded-[2rem] sm:p-8"
                  >
                    <span className="font-serif text-lg text-ink">
                      CogCare {selectedCard.category} Resource
                    </span>
                    <div className="w-12 h-12 rounded-full bg-page flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-all shrink-0">
                      <ArrowRight className="w-5 h-5" aria-hidden />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-border bg-surface py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 grid gap-12 md:mb-24 md:grid-cols-3 md:gap-16">
            <div className="md:col-span-2">
              <span className="mb-6 block font-serif text-3xl italic tracking-tight text-forest sm:mb-10 sm:text-4xl">
                CogCare.org
              </span>
              <p className="mb-6 max-w-sm text-base font-light italic leading-relaxed text-ink-faint sm:mb-8">
                A modern boutique initiative for brain longevity. Designed to
                empower, grounded in clinical proof, and accessible to everyone.
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-clay">
                Cognitive Care Alliance is a 501(c)(3) organization.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-forest mb-10 opacity-40">
                Essentials
              </p>
              <ul className="space-y-6 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
                <li>
                  <a
                    href="https://cogcare.org/"
                    className="hover:opacity-50 transition-opacity"
                    rel="noopener noreferrer"
                  >
                    Education Portal
                  </a>
                </li>
                <li>
                  <a
                    href="https://cogcare.org/blog/"
                    className="hover:opacity-50 transition-opacity"
                    rel="noopener noreferrer"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="https://cogcare.org/"
                    className="hover:opacity-50 transition-opacity"
                    rel="noopener noreferrer"
                  >
                    Donation Hub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 border-t border-border pt-10 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:pt-16 md:text-left">
            <p className="text-[10px] font-bold uppercase italic tracking-[0.25em] text-ink-faint">
              © 2026 CogCare Initiative • Empowering Cognitive Resilience
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.25em] text-ink-faint sm:gap-10">
              <a
                href="https://cogcare.org/blog/"
                className="hover:text-forest transition-colors"
                rel="noopener noreferrer"
              >
                Blog
              </a>
              <a
                href="https://cogcare.org/"
                className="hover:text-forest transition-colors"
                rel="noopener noreferrer"
              >
                Privacy & Terms
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showIntro && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest/30 backdrop-blur-md p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-title"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-page shadow-2xl p-8 sm:p-10">
            <button
              ref={closeIntroRef}
              type="button"
              onClick={() => setShowIntro(false)}
              className="absolute top-5 right-5 text-ink-faint hover:text-ink transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl bg-forest text-white px-6 py-5 mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                The clinical bottom line
              </p>
              <p className="text-base font-semibold leading-snug">
                By the time caregivers <em>notice</em> cognitive decline, it has been quietly progressing for 10–20 years. The window to act is now. Not later.
              </p>
            </div>

            <h2 id="intro-title" className="text-xl font-bold text-forest mb-4 leading-snug">
              What we're actually measuring
            </h2>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: 'Memory', sub: 'encoding & recall' },
                { label: 'Attention', sub: 'focus & vigilance' },
                { label: 'Processing speed', sub: 'reaction & fluency' },
                { label: 'Executive function', sub: 'planning & control' },
              ].map(({ label, sub }) => (
                <div key={label} className="rounded-xl border border-forest/10 bg-white px-4 py-3">
                  <p className="text-xs font-bold text-forest">{label}</p>
                  <p className="text-[10px] text-ink-faint mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowIntro(false)
                setShowQuiz(true)
              }}
              className="w-full bg-forest text-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all mb-6"
            >
              Start My Assessment
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>

            <div className="rounded-2xl bg-forest/5 border border-forest/10 px-5 py-4 mb-5 text-sm text-ink-muted flex gap-3 items-start">
              <Brain className="w-5 h-5 text-forest mt-0.5 shrink-0" aria-hidden />
              <p>
                You'll receive a <strong className="text-forest">personalised Brain Health report</strong> for your loved one, saved to your account and emailable to their doctor, so your observations are always on record.
              </p>
            </div>
          </div>
        </div>
      )}

      <BrainHealthIndex
        open={showQuiz}
        onClose={handleCloseQuiz}
        quizAnswers={quizAnswers}
        setQuizAnswers={setQuizAnswers}
        quizResults={quizResults}
        setQuizResults={setQuizResults}
      />
    </div>
  )
}
