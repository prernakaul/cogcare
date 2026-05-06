import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Calendar, Map, Shield, Download, Mail, Share2, Check, Info, Loader2 } from 'lucide-react'
import { downloadReportPdf } from '../lib/downloadReportPdf'

const GSI_LEVELS = [
  { short: 'Optimal' },
  { short: 'Mild' },
  { short: 'Moderate' },
  { short: 'Significant' },
  { short: 'Severe' },
]

const PHENOTYPES = {
  neuroinflammatory: {
    name: 'Neuroinflammatory Phenotype',
    desc: "{name}'s responses point to brain fatigue driven by inflammation -- often triggered by illness, stress, or infection. This shows up as persistent fog, low energy, headaches, and sensitivity to light or noise.",
  },
  cognitive: {
    name: 'Cognitive-Phasic Phenotype',
    desc: "The responses highlight difficulty with focus, organisation, and recalling words or information. This reflects a brain that can still function well but tires quickly under mental load.",
  },
  autonomic: {
    name: 'Anxiety / Autonomic Phenotype',
    desc: "The pattern suggests {name}'s stress and nervous system are out of balance -- producing tension, poor sleep, and physical symptoms like a racing heart or dizziness.",
  },
  longevity: {
    name: 'Longevity / Performance Phenotype',
    desc: "No significant impairment detected -- {name}'s brain is functioning well. The opportunity here is optimisation: sharper focus, better energy, and protecting long-term brain health.",
  },
  severe: {
    name: 'Severe Deficit Phenotype',
    desc: "Multiple areas of brain function are significantly affected, suggesting the brain's systems are under serious strain. This profile benefits most from a structured, comprehensive evaluation.",
  },
}

const DOMAIN_COPY = {
  nif: {
    elevated: "This area shows significant strain -- {name} likely experiences persistent fog, low energy, and worsening symptoms after activity. This pattern is common after illness, chronic stress, or long-term inflammation.",
    moderate: "Some brain fatigue is present, with energy and clarity dipping more than expected. Afternoons and busier days tend to be harder.",
    low:      "Brain energy and clarity appear to be holding up well in this area.",
  },
  cog: {
    elevated: "Focus, organisation, and word-finding are significantly affected -- {name} may feel mentally slow, easily distracted, or unable to stay on task for long. This reflects a brain under sustained cognitive strain.",
    moderate: "Attention and thinking take more effort than usual, and mental stamina may fade as the day goes on. Task-switching and staying organised can feel harder.",
    low:      "Focus and thinking appear to be working well for day-to-day demands.",
  },
  aux: {
    elevated: "The nervous system is in a persistent state of overdrive -- producing poor sleep, physical tension, and symptoms like palpitations or dizziness. Stress and recovery are significantly out of balance.",
    moderate: "There are signs of nervous system strain, with background tension and disrupted sleep feeding into each other. Rest does not feel as restorative as it should.",
    low:      "Stress and nervous system regulation appear balanced in this area.",
  },
  vest: {
    elevated: "Dizziness, motion sensitivity, or sensory overload are significantly present -- {name} may feel off-balance or easily overwhelmed in busy environments. This often overlaps with fatigue or stress-related patterns.",
    moderate: "Mild balance or sensory sensitivity is present, tending to worsen in busy or stimulating settings. This is worth monitoring alongside other symptoms.",
    low:      "Balance and sensory processing appear stable.",
  },
}

const DOMAIN_META = {
  nif:  { emoji: '🔥', label: 'Brain Energy & Clarity' },
  cog:  { emoji: '🧠', label: 'Focus & Thinking' },
  aux:  { emoji: '💫', label: 'Stress & Nervous System' },
  vest: { emoji: '⚖️', label: 'Balance & Senses' },
}

function clusterLevel(score) {
  if (score == null || isNaN(score)) return 'low'
  if (score >= 3.5) return 'elevated'
  if (score >= 2.0) return 'moderate'
  return 'low'
}

const CONCERN_LABEL = { low: 'Low concern', moderate: 'Moderate concern', elevated: 'Elevated concern' }

const CONCERN_STYLE = {
  low:      { bg: '#EEF5F0', border: '#B8D9C1', color: '#2A5A3A', dot: '#4A9060' },
  moderate: { bg: '#FDF3E8', border: '#F0C07A', color: '#7A4A10', dot: '#C4813A' },
  elevated: { bg: '#FBF0ED', border: '#DFA89E', color: '#7A2E1F', dot: '#A84232' },
}

function StageSpectrum({ gsiIndex }) {
  const pct = (gsiIndex / (GSI_LEVELS.length - 1)) * 100
  return (
    <div style={{ padding: '4px 0 8px' }}>
      <div style={{
        position: 'relative', height: 10, borderRadius: 9999, overflow: 'visible',
        background: 'linear-gradient(to right, #4A9060, #8DC07A, #E8C060, #D4804A, #A84232)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {GSI_LEVELS.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: -3, bottom: -3,
            left: `${(i / (GSI_LEVELS.length - 1)) * 100}%`,
            transform: 'translateX(-50%)',
            width: i === 0 || i === GSI_LEVELS.length - 1 ? 0 : 1,
            background: 'rgba(255,255,255,0.5)',
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 22, height: 22,
          background: 'var(--color-white)',
          borderRadius: '50%',
          border: '3px solid var(--color-forest)',
          boxShadow: '0 2px 8px rgba(26,60,52,0.25)',
          zIndex: 2,
          transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%', background: 'var(--color-forest)',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {GSI_LEVELS.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: i === gsiIndex ? 10 : 9,
            fontWeight: i === gsiIndex ? 700 : 500,
            color: i === gsiIndex ? 'var(--color-forest)' : 'rgba(61,75,62,0.4)',
            lineHeight: 1.3,
            transition: 'all 0.3s',
          }}>
            {s.short}
            {i === gsiIndex && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-forest)', margin: '4px auto 0' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DomainCard({ domain, level, delay, name }) {
  const meta = DOMAIN_META[domain]
  const sty = CONCERN_STYLE[level] ?? CONCERN_STYLE.low
  const copy = (DOMAIN_COPY[domain]?.[level] ?? '').replace(/\{name\}/g, name || 'your loved one')
  return (
    <div className={`fade-up ${delay}`} style={{
      background: sty.bg, border: `1px solid ${sty.border}`,
      borderRadius: 18, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--color-ink)' }}>{meta.label}</span>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
          padding: '3px 10px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)',
          color: sty.color, whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sty.dot, display: 'inline-block', flexShrink: 0 }} />
          {CONCERN_LABEL[level]}
        </span>
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.65, color: sty.color, margin: 0 }}>
        {copy}
      </p>
    </div>
  )
}

function CarePathway() {
  const steps = [
    { icon: <Brain size={18} />, label: 'Today', sublabel: 'Assessment complete', desc: "You've taken the most important first step -- noticing and acting.", active: true },
    { icon: <Calendar size={18} />, label: 'Next 7-14 days', sublabel: 'Specialist consult', desc: 'A 45-minute session with a cognitive health specialist to interpret these results.', active: false },
    { icon: <Map size={18} />, label: 'Next 3-6 months', sublabel: 'Personalised care plan', desc: 'A structured roadmap: monitoring cadence, lifestyle interventions, and next evaluations.', active: false },
  ]
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 28, left: 28, right: 28, height: 2,
        background: 'linear-gradient(to right, var(--color-forest), rgba(61,75,62,0.2))',
        zIndex: 0,
      }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, position: 'relative', zIndex: 1 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: s.active ? 'var(--color-forest)' : 'var(--color-white)',
              border: `2px solid ${s.active ? 'var(--color-forest)' : 'var(--color-border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
              boxShadow: s.active ? '0 6px 20px rgba(61,75,62,0.2)' : '0 2px 8px rgba(26,60,52,0.06)',
              color: s.active ? 'var(--color-white)' : 'var(--color-forest)',
            }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-clay)', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-forest)', marginBottom: 6, lineHeight: 1.3 }}>{s.sublabel}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-slate)', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BHIReportContent({
  quizResults,
  showActions = true,
  email, setEmail,
  emailStatus, emailMessage,
  onSendEmail, canEmail,
  onResetEmail,
  onSendGuideEmail,
  /** Quiz/report overlay: sign-in + inline scheduler flow */
  onConsultClick,
  /** Dashboard saved report: deep-link to booking with query params */
  consultBookingTo,
  /** Show banner above email block when user chose to book but must email first */
  consultEmailHint,
}) {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showGuideForm, setShowGuideForm] = useState(false)
  const [guideEmail, setGuideEmail] = useState('')
  const [guideSent, setGuideSent] = useState(false)
  const [guideError, setGuideError] = useState('')
  const [guideSending, setGuideSending] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)

  useEffect(() => {
    if (!consultEmailHint) return
    const t = window.setTimeout(() => {
      document.getElementById('bhi-share-email-input')?.focus()
      document.getElementById('bhi-share-email-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
    return () => window.clearTimeout(t)
  }, [consultEmailHint])

  const showEmailSection = showEmailForm || Boolean(consultEmailHint)

  if (!quizResults) return null

  const { lovedOneName, lovedOneAge, phenotype, nif, cog, aux, vest, gsi } = quizResults
  const name = lovedOneName || 'Your loved one'
  const gsiIndex = Math.max(0, Math.min(4, Math.round(gsi ?? 0)))
  const pheno = PHENOTYPES[phenotype ?? 'longevity'] ?? PHENOTYPES.longevity

  const domains = [
    { key: 'nif',  level: clusterLevel(nif) },
    { key: 'cog',  level: clusterLevel(cog) },
    { key: 'aux',  level: clusterLevel(aux) },
    { key: 'vest', level: clusterLevel(vest) },
  ]
  const elevatedCount = domains.filter(d => d.level === 'elevated').length
  const moderateCount = domains.filter(d => d.level === 'moderate').length

  const handleShareClick = () => {
    setShowEmailForm(true)
    setTimeout(() => {
      document.getElementById('bhi-share-email-input')?.focus()
    }, 50)
  }

  const handleSendGuide = async () => {
    const trimmed = guideEmail.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setGuideError('Please enter a valid email address.')
      return
    }
    if (!onSendGuideEmail) { setGuideSent(true); return }
    setGuideSending(true)
    try {
      await onSendGuideEmail(trimmed)
      setGuideSent(true)
    } catch {
      setGuideError('Could not send. Please try again.')
    } finally {
      setGuideSending(false)
    }
  }

  return (
    <div style={{ maxWidth: 660, margin: '0 auto' }}>

      {/* 1. Caregiver validation opener */}
      <div className="fade-up d1" style={{
        background: 'linear-gradient(135deg, rgba(74,144,96,0.07) 0%, rgba(243,239,233,0.6) 100%)',
        border: '1px solid rgba(74,144,96,0.18)',
        borderRadius: 24, padding: '24px 26px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
            background: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 2,
          }}>
            <Check size={16} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.15rem', lineHeight: 1.55, color: 'var(--color-ink)', fontStyle: 'italic', marginBottom: 8,
            }}>
              You noticed something was different. That instinct is almost always right --{' '}
              <strong style={{ fontStyle: 'normal', color: 'var(--color-forest)' }}>
                most caregivers notice signs 1-2 years before a formal diagnosis.
              </strong>
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--color-slate)', lineHeight: 1.6, margin: 0 }}>
              This report reflects what you shared about {name}{lovedOneAge ? `, age ${lovedOneAge}` : ''}. It is a clinical screening guide, not a diagnosis.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Brain Health Index result */}
      <div className="fade-up d2" style={{
        background: 'var(--color-white)', border: '1px solid var(--color-border)',
        borderRadius: 24, padding: '22px 24px', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(26,60,52,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 6 }}>
              Brain Health Index
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', color: 'var(--color-ink)', lineHeight: 1.2 }}>
              {pheno.name}
            </div>
          </div>
          <div style={{
            flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--color-forest)', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 9999, padding: '5px 14px', marginTop: 4,
          }}>
            For {name}
          </div>
        </div>
        <StageSpectrum gsiIndex={gsiIndex} />
        <div style={{ marginTop: 14, borderRadius: 14, border: '1px solid var(--color-border)', padding: '14px 16px', background: 'var(--color-bg)' }}>
          <p style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5, margin: '0 0 10px' }}>
            {pheno.desc.replace(/\{name\}/g, name)}
          </p>
          <div style={{ height: 1, borderTop: '1px dashed var(--color-border)', margin: '10px 0' }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={13} style={{ color: 'var(--color-clay)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11.5, color: 'var(--color-clay)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
              This is a screening indicator, not a medical diagnosis. Only a licensed clinician can diagnose cognitive conditions.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Brain health clusters */}
      <div className="fade-up d3" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 6 }}>
            Brain Health Clusters
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', color: 'var(--color-ink)', lineHeight: 1.25, marginBottom: 8 }}>
            What the assessment revealed
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--color-slate)', lineHeight: 1.6, margin: 0 }}>
            Based on your responses, {name} shows{' '}
            {elevatedCount > 0 && <><strong style={{ color: '#7A2E1F' }}>{elevatedCount} elevated</strong> and </>}
            <strong style={{ color: '#7A4A10' }}>{moderateCount} moderate</strong> area{moderateCount !== 1 ? 's' : ''} across four brain health clusters.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {domains.map((d, i) => (
            <DomainCard key={d.key} domain={d.key} level={d.level} delay={`d${i + 4}`} name={name} />
          ))}
        </div>
      </div>

      {/* 4. Care pathway */}
      <div className="fade-up d5" style={{
        background: 'var(--color-white)', border: '1px solid var(--color-border)',
        borderRadius: 24, padding: '22px 24px', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(26,60,52,0.05)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 6 }}>
          Your Care Pathway
        </div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', color: 'var(--color-ink)', marginBottom: 20, lineHeight: 1.25 }}>
          A clear path forward
        </div>
        <CarePathway />
      </div>

      {/* 5. What happens in a consult */}
      <div className="fade-up d6" style={{
        background: 'rgba(243,239,233,0.55)', border: '1px solid var(--color-border)',
        borderRadius: 24, padding: '22px 26px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
          <Shield size={16} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', color: 'var(--color-forest)' }}>
            What actually happens in a consult
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['No surprises', `The specialist will have already reviewed this report. The session is a conversation, not an exam. ${name} will not be "tested" in a stressful way.`],
            ['Your loved one stays comfortable', `Cognitive assessments are designed to be calm and conversational. Most people find them less intimidating than they expected.`],
            ['You are part of the conversation', `Caregivers are an essential part of the appointment. Your observations -- like the ones you recorded today -- are clinical data.`],
            ['No commitment required', `The consult produces a recommendation, not an obligation. You leave with clarity and options, not a forced care plan.`],
          ].map(([title, body], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                background: 'var(--color-forest)', color: 'var(--color-white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, marginTop: 1,
              }}>{i + 1}</div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-forest)' }}>{title}. </span>
                <span style={{ fontSize: 13, color: 'var(--color-slate)', lineHeight: 1.65 }}>{body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Primary CTA */}
      <div className="fade-up d7" style={{
        background: 'linear-gradient(135deg, var(--color-forest-deep) 0%, var(--color-forest) 100%)',
        borderRadius: 28, padding: '28px 28px 24px', marginBottom: 20,
        boxShadow: '0 12px 40px rgba(26,60,52,0.18)',
      }}>
        {/* Doctor intro */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 22 }}>
          <img
            src="https://bri.ucla.edu/wp-content/uploads/2025/03/Nasir_I_Photo.jpg"
            alt="Dr. Imaad Nasir, M.D."
            style={{
              width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            }}
          />
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'white', margin: '0 0 3px' }}>
              Dr. Imaad Nasir, M.D.
            </p>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A67B5B', margin: '0 0 8px' }}>
              Neurology · UCLA Brain Research Institute
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
              Assistant Clinical Professor at UCLA's David Geffen School of Medicine. Book a free consult to discuss what these results mean for your loved one.
            </p>
          </div>
        </div>
        {typeof onConsultClick === 'function' ? (
          <button
            type="button"
            onClick={onConsultClick}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '18px 28px',
              background: 'var(--color-white)', color: 'var(--color-forest)', border: 'none', borderRadius: 9999,
              fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
              cursor: 'pointer',
              marginBottom: 14,
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          >
            Review these results with a cognitive specialist
            <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.6, fontWeight: 500 }}>Recommended</span>
          </button>
        ) : consultBookingTo ? (
          <Link
            to={consultBookingTo}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '18px 28px',
              background: 'var(--color-white)', color: 'var(--color-forest)', border: 'none', borderRadius: 9999,
              fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
              textDecoration: 'none', marginBottom: 14,
              boxSizing: 'border-box',
            }}
          >
            Review these results with a cognitive specialist
            <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.6, fontWeight: 500 }}>Recommended</span>
          </Link>
        ) : (
          <a
            href="https://calendly.com/cogcare/30min"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '18px 28px',
              background: 'var(--color-white)', color: 'var(--color-forest)', border: 'none', borderRadius: 9999,
              fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
              textDecoration: 'none', marginBottom: 14,
              boxSizing: 'border-box',
            }}
          >
            Review these results with a cognitive specialist
            <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.6, fontWeight: 500 }}>Recommended</span>
          </a>
        )}
        <p style={{
          textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.6, fontStyle: 'italic', margin: 0,
        }}>
          You're not overreacting. Getting expert eyes on this early is one of the most loving things you can do.
        </p>
      </div>

      {/* 7. Save / share */}
      {showActions && <>
      {consultEmailHint ? (
        <div
          className="fade-up d6"
          style={{
            marginBottom: 16,
            borderRadius: 16,
            border: '1px solid rgba(74,144,96,0.35)',
            background: 'rgba(238,245,240,0.95)',
            padding: '14px 16px',
            fontSize: 13,
            color: 'var(--color-forest)',
            lineHeight: 1.55,
          }}
          role="status"
        >
          {consultEmailHint}
        </div>
      ) : null}
      <div className="fade-up d7" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(61,75,62,0.45)', textAlign: 'center', marginBottom: 14 }}>
          Save or share this report
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: pdfBusy ? 'Generating…' : 'Download PDF', sub: 'Full report', icon: pdfBusy ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={15} />, onClick: async () => { setPdfBusy(true); try { await downloadReportPdf(quizResults, 'BrainHealthIndex-Report') } finally { setPdfBusy(false) } } },
            { label: 'Email to family', sub: 'Share with loved ones', icon: <Mail size={15} />, onClick: handleShareClick },
            { label: 'Send to doctor', sub: 'Share with their GP', icon: <Share2 size={15} />, onClick: handleShareClick },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick} disabled={i === 0 && pdfBusy} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '16px 10px', gap: 6,
              background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 18,
              color: 'var(--color-forest)', cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s',
              fontFamily: 'inherit',
            }}>
              <span>{btn.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{btn.label}</span>
              <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(61,75,62,0.5)' }}>{btn.sub}</span>
            </button>
          ))}
        </div>

        {showEmailSection && (
          <div style={{ marginTop: 12, border: '1px solid var(--color-border)', borderRadius: 16, padding: '16px 18px', background: 'var(--color-bg)' }}>
            {emailStatus === 'sent' ? (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 8 }}>
                  Check your inbox
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-forest)', margin: '0 0 8px' }}>
                  Your Brain Health Index report has been sent to {email}.
                </p>
                <button onClick={onResetEmail} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--color-clay)', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>
                  Wrong email? Try again
                </button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-forest)', marginBottom: 10, opacity: 0.7 }}>
                  Enter your email and we'll send you the full report.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="bhi-share-email-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') onSendEmail() }}
                    disabled={emailStatus === 'sending'}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10,
                      border: '1px solid var(--color-border)', background: 'var(--color-white)',
                      fontSize: 13, color: 'var(--color-ink)', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={onSendEmail}
                    disabled={!canEmail || emailStatus === 'sending'}
                    style={{
                      padding: '10px 18px', borderRadius: 10,
                      background: 'var(--color-forest)', color: 'var(--color-white)', border: 'none',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em',
                      textTransform: 'uppercase', opacity: emailStatus === 'sending' ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                    }}
                  >
                    {emailStatus === 'sending' ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />Sending</> : 'Send'}
                  </button>
                </div>
                {emailStatus === 'error' && emailMessage && (
                  <p style={{ fontSize: 12, color: '#A84232', marginTop: 8, lineHeight: 1.5 }}>{emailMessage}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* 8. Not ready to book */}
      <div className="fade-up d8" style={{
        border: '1px dashed var(--color-border)', borderRadius: 20, padding: '20px 22px',
        textAlign: 'center', marginBottom: 8,
      }}>
        {!showGuideForm ? (
          <>
            <p style={{ fontSize: 13.5, color: 'var(--color-forest)', marginBottom: 6, lineHeight: 1.6 }}>
              <strong>Not ready to book?</strong> That's okay.
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--color-slate)', marginBottom: 12, lineHeight: 1.6 }}>
              Get our caregiver's guide + symptom tracker by email. Free, no commitment.
            </p>
            <button onClick={() => setShowGuideForm(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13.5, fontWeight: 600, color: 'var(--color-clay)',
              textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit',
            }}>
              Send me the caregiver's guide →
            </button>
          </>
        ) : guideSent ? (
          <p style={{ fontSize: 13, color: 'var(--color-forest)', fontWeight: 500, margin: 0 }}>Guide sent! Check your inbox.</p>
        ) : (
          <>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={guideEmail}
              onChange={e => { setGuideEmail(e.target.value); setGuideError('') }}
              onKeyDown={async e => { if (e.key === 'Enter') await handleSendGuide() }}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                border: `1px solid ${guideError ? 'var(--color-clay)' : 'var(--color-border)'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleSendGuide}
              disabled={guideSending}
              style={{
                padding: '10px 16px', borderRadius: 10,
                background: 'var(--color-clay)', color: 'var(--color-white)', border: 'none',
                fontSize: 11, fontWeight: 700, cursor: guideSending ? 'default' : 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'inherit',
                opacity: guideSending ? 0.6 : 1,
              }}
            >
              {guideSending ? '…' : 'Send'}
            </button>
          </div>
          {guideError && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--color-clay)' }}>{guideError}</p>}
          </>
        )}
      </div>
      </>}

    </div>
  )
}
