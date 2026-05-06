// CogCare.org Homepage — Sections

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Ico,
  Blob,
  PortraitPlaceholder,
  Section,
  SectionLabel,
  DisplayH2,
  BodyLead,
  BtnPrimary,
  BtnGhost,
} from './home-primitives.jsx'

const BLOG_URL = 'https://blog.cogcare.org'

const navLinkStyle = {
  fontSize: 13,
  color: 'var(--color-forest)',
  textDecoration: 'none',
  fontWeight: 500,
  opacity: 0.75,
  transition: 'opacity 0.2s',
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════════════

function Nav({ onPrimaryCta, authIdentity }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(253,251,247,0.88)' : 'rgba(253,251,247,0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid var(--color-sand)' : '1px solid transparent',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Ico.brain size={22} color="var(--color-clay)" />
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, color: 'var(--color-forest)', letterSpacing: '-0.02em', fontWeight: 500
          }}>
            Cog<em style={{ fontStyle: 'italic' }}>Care</em>
          </span>
        </Link>

        <div className="nav-links" style={{
          display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'nowrap'
        }}>
          {['How it works', 'The Index', 'Science', 'About', 'FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} style={{ ...navLinkStyle, whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.75}>
              {l}
            </a>
          ))}
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-nav-desktop-only"
            style={{ ...navLinkStyle, whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.75}
          >
            Blog
          </a>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-nav-mobile-only"
            style={{ ...navLinkStyle, whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.75}
          >
            Blog
          </a>
          {authIdentity === 'signedIn' ? (
            <Link
              to="/dashboard"
              style={{
                fontSize: 13, color: 'var(--color-forest)', textDecoration: 'none',
                fontWeight: 500, opacity: 0.75, whiteSpace: 'nowrap',
              }}
            >
              My dashboard
            </Link>
          ) : authIdentity === 'loading' ? (
            <span style={{ fontSize: 13, color: 'var(--color-forest)', opacity: 0.5 }}>…</span>
          ) : (
            <Link
              to="/login"
              className="nav-cta-getinside"
              style={{
                fontSize: 13, color: 'var(--color-forest)', textDecoration: 'none',
                fontWeight: 500, opacity: 0.75, whiteSpace: 'nowrap',
              }}
            >
              Get Inside
            </Link>
          )}
          <BtnPrimary
            onClick={onPrimaryCta}
            style={{ padding: '10px 16px', fontSize: 10, whiteSpace: 'nowrap', letterSpacing: '0.1em' }}
          >
            Take Brain Health Index
          </BtnPrimary>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO — Editorial
// ═══════════════════════════════════════════════════════════════════════════

function Hero({ tone, audience, headlineCopy, onPrimaryCta, onLearnHow }) {
  const copy = {
    warm: {
      eyebrow: 'Brain Health Index · 5 minutes',
      headline: <>You noticed something.<br /><em>That instinct<br />deserves to be taken seriously.</em></>,
      sub: "A warm, confidential assessment that turns what you've observed about a loved one into a clear next step — reviewed by cognitive specialists."
    },
    clinical: {
      eyebrow: 'Clinically validated · 5-minute screening',
      headline: <>Early signs matter. <em>We help you read them.</em></>,
      sub: "The Brain Health Index is a structured screening tool that translates observed behaviors into domain-level cognitive indicators, reviewed by board-certified specialists."
    },
    urgent: {
      eyebrow: 'The window matters',
      headline: <>The first two years are the ones that count. <em>Don't wait.</em></>,
      sub: "Most caregivers notice signs 1–2 years before diagnosis. Early action opens every door — from reversible causes to disease-modifying therapies. Start in 5 minutes."
    }
  };
  const c = copy[tone] || copy.warm;
  const head = headlineCopy || c.headline;

  return (
    <Section style={{ padding: 'clamp(40px, 6vw, 80px) 0 clamp(60px, 8vw, 100px)' }}>
      <div className="hero-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 'clamp(32px, 5vw, 80px)',
        alignItems: 'center'
      }}>
        {/* Copy side */}
        <div>
          <SectionLabel style={{ marginBottom: 24 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 10px', background: 'rgba(166,123,91,0.08)',
              border: '1px solid rgba(166,123,91,0.2)',
              borderRadius: 9999, color: 'var(--color-clay)'
            }}>
              <span style={{ width: 6, height: 6, background: 'var(--color-clay)', borderRadius: '50%' }} />
              {c.eyebrow}
            </span>
          </SectionLabel>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.25rem, 5.5vw, 4.2rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--color-forest)',
            marginBottom: 24,
            textWrap: 'balance'
          }}>
            {head}
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.35vw, 18px)',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: 520,
            marginBottom: 36,
            textWrap: 'pretty'
          }}>
            {c.sub}
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <BtnPrimary onClick={onPrimaryCta} large>
              Take the Brain Health Index
              <Ico.arrowRight size={14} color="white" />
            </BtnPrimary>
            <BtnGhost onClick={onLearnHow}>
              <Ico.clock size={14} /> Learn how it works
            </BtnGhost>
          </div>

          {/* Trust strip */}
          <div style={{
            display: 'flex', gap: 28, marginTop: 48, flexWrap: 'wrap',
            paddingTop: 28, borderTop: '1px solid var(--color-sand)'
          }}>
            {[
              { icon: <Ico.shield size={16} color="var(--color-clay)" />, label: 'HIPAA-grade privacy' },
              { icon: <Ico.heart size={16} color="var(--color-clay)" />, label: 'Nonprofit 501(c)(3)' },
              { icon: <Ico.users size={16} color="var(--color-clay)" />, label: 'Reviewed by specialists' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {t.icon}
                <span style={{
                  fontSize: 12, color: 'var(--color-forest)', opacity: 0.75,
                  fontWeight: 500
                }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image side */}
        <div style={{ position: 'relative', minHeight: 480 }}>
          {/* Organic background blobs */}
          <Blob color="var(--color-clay)" opacity={0.08} style={{ top: -40, right: -60, width: 260, height: 260 }} />
          <Blob color="var(--color-forest)" opacity={0.06} style={{ bottom: -40, left: -40, width: 200, height: 200 }} />

          {/* Hero photo — same asset as pre–design-system home */}
          <div style={{
            position: 'relative',
            aspectRatio: '4/5',
            maxWidth: 'min(100%, 28rem)',
            margin: '0 auto',
            borderRadius: 'clamp(2rem, 4vw, 4.5rem)',
            overflow: 'hidden',
            boxShadow: '0 30px 80px -20px rgba(26,60,52,0.22), 0 0 0 1px rgba(232, 220, 196, 0.9)',
            transform: 'rotate(-1deg)',
            border: 'clamp(8px, 1.5vw, 16px) solid white',
          }}>
            <img
              src="https://images.unsplash.com/photo-1694009514875-025cd00ed625?w=900&q=80"
              alt="Older and younger woman holding hands, a warm moment of care and connection"
              width={900}
              height={1125}
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%',
                filter: 'grayscale(0.05)',
                display: 'block',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(61, 75, 62, 0.05)',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Floating quote card */}
          <div style={{
            position: 'absolute', bottom: -24, left: -24,
            background: 'white',
            border: '1px solid var(--color-sand)',
            borderRadius: 20,
            padding: '18px 22px',
            maxWidth: 280,
            boxShadow: '0 20px 40px -10px rgba(26,60,52,0.18)',
            transform: 'rotate(2deg)'
          }}>
            <Ico.quote size={20} color="var(--color-clay)" />
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 15, fontStyle: 'italic', color: 'var(--color-forest)',
              lineHeight: 1.5, marginTop: 8
            }}>
              Finally, something that took what I'd been noticing seriously.
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 8, fontWeight: 500 }}>
              — Elena R., daughter
            </p>
          </div>

          {/* Trust badge */}
          <div style={{
            position: 'absolute', top: 20, right: -12,
            background: 'var(--color-forest)',
            color: 'white',
            borderRadius: 16,
            padding: '14px 18px',
            boxShadow: '0 12px 30px -8px rgba(26,60,52,0.3)',
            transform: 'rotate(3deg)'
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, opacity: 0.7,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4
            }}>Completed by</div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28, fontWeight: 400, lineHeight: 1
            }}>12,400+</div>
            <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>caregivers</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Tell us what you\'ve noticed',
      desc: 'Eight minutes of gentle questions about memory, language, attention, and behavior — drawn directly from validated clinical screening tools.',
      detail: 'No medical jargon'
    },
    {
      n: '02',
      title: 'Receive a structured report',
      desc: 'Your observations are mapped to cognitive domains and a stage indicator. Written for humans — not a clinician\'s summary thrown at you.',
      detail: 'Instant · Shareable with family'
    },
    {
      n: '03',
      title: 'Talk to a specialist if you want',
      desc: 'Review the report with a board-certified cognitive specialist in a 45-minute conversation. No obligation. No rushed exam.',
      detail: 'Optional · Covered by most insurance'
    }
  ];

  return (
    <Section id="how-it-works" bg="var(--color-cream)">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'start' }}>
        <div style={{ maxWidth: 420 }}>
          <SectionLabel>How CogCare works</SectionLabel>
          <DisplayH2 style={{ marginBottom: 20 }}>
            Three quiet steps,<br/>from noticing to knowing.
          </DisplayH2>
          <BodyLead>
            The hardest part is often the first one — trusting your instinct enough to do anything with it. We designed the Index to make that step small, calm, and private.
          </BodyLead>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 16 }} className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 24,
              alignItems: 'start',
              padding: '28px 32px',
              background: 'white',
              border: '1px solid var(--color-sand)',
              borderRadius: 24,
              boxShadow: '0 2px 10px rgba(26,60,52,0.04)',
              transition: 'transform 0.25s, box-shadow 0.25s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,60,52,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(26,60,52,0.04)'; }}
            >
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 36, fontStyle: 'italic',
                color: 'var(--color-clay)',
                lineHeight: 1, opacity: 0.6
              }}>{s.n}</div>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22, fontWeight: 500,
                  color: 'var(--color-forest)',
                  marginBottom: 8, letterSpacing: '-0.01em'
                }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>{s.desc}</p>
                <span style={{
                  fontSize: 11, color: 'var(--color-clay)', fontWeight: 600,
                  letterSpacing: '0.08em'
                }}>{s.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRAIN HEALTH INDEX — what it measures
// ═══════════════════════════════════════════════════════════════════════════

function TheIndex({ onPrimaryCta }) {
  const domains = [
    { key: 'memory', emoji: '🧩', title: 'Memory', desc: 'Short-term recall, repetition patterns, event memory, reminder dependence.' },
    { key: 'language', emoji: '💬', title: 'Language', desc: 'Word retrieval, sentence completion, conversational fluency, naming objects.' },
    { key: 'attention', emoji: '🔍', title: 'Attention', desc: 'Focus on tasks, orientation in familiar places, following multi-step instructions.' },
    { key: 'behavior', emoji: '🌿', title: 'Behavior & mood', desc: 'Personality shifts, withdrawal, anxiety, apathy, sleep rhythm changes.' },
  ];

  return (
    <Section id="the-index">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
        {/* Left: copy */}
        <div>
          <SectionLabel>The Brain Health Index</SectionLabel>
          <DisplayH2 style={{ marginBottom: 24 }}>
            Four domains.<br/>
            One clear picture.
          </DisplayH2>
          <BodyLead style={{ marginBottom: 28 }}>
            The Index evaluates four evidence-backed cognitive domains drawn from the CDR, MoCA, and MMSE clinical scales — adapted into questions that <em>caregivers</em> can answer about observed behavior.
          </BodyLead>

          <div style={{
            padding: '20px 22px',
            background: 'rgba(166,123,91,0.06)',
            border: '1px solid rgba(166,123,91,0.2)',
            borderRadius: 16,
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Ico.sparkle size={16} color="var(--color-clay)" />
              <span style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.15em', color: 'var(--color-clay)'
              }}>What you get</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.65 }}>
              A stage indicator (Normal → Advanced), per-domain concern levels, and a 3-step care pathway — all written in the language you actually speak.
            </p>
          </div>

          <BtnPrimary onClick={onPrimaryCta}>
            Start the Index <Ico.arrowRight size={13} color="white" />
          </BtnPrimary>
        </div>

        {/* Right: domain cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          {domains.map((d, i) => (
            <div key={d.key} style={{
              padding: '24px 22px',
              background: 'white',
              border: '1px solid var(--color-sand)',
              borderRadius: 20,
              transition: 'all 0.25s',
              transform: i % 2 === 0 ? 'translateY(16px)' : 'none'
            }}>
              <div style={{ fontSize: 28, marginBottom: 14, lineHeight: 1 }}>{d.emoji}</div>
              <h4 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20, fontWeight: 500, color: 'var(--color-forest)',
                marginBottom: 8, letterSpacing: '-0.01em'
              }}>{d.title}</h4>
              <p style={{
                fontSize: 12.5, color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WHY EARLY DETECTION — stat-driven
// ═══════════════════════════════════════════════════════════════════════════

function WhyEarly() {
  const stats = [
    { big: '1–2', unit: 'years', label: 'Caregivers notice signs before a formal diagnosis is made.', source: 'Alzheimer\'s Association, 2024' },
    { big: '40%', unit: '', label: 'Of dementia cases are potentially preventable with early intervention on modifiable risks.', source: 'The Lancet Commission, 2024' },
    { big: '3×', unit: '', label: 'More treatment options are available at the Mild stage than at Moderate or Advanced.', source: 'Neurology, 2023' },
  ];

  return (
    <Section bg="var(--color-forest)" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative */}
      <Blob color="#FDFBF7" opacity={0.04} style={{ top: '-10%', right: '-5%', width: 400, height: 400 }} />
      <Blob color="var(--color-clay)" opacity={0.12} style={{ bottom: '-20%', left: '-10%', width: 500, height: 500 }} />

      <div style={{ position: 'relative', maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel style={{ color: 'rgba(255,255,255,0.5)' }}>Why early detection changes everything</SectionLabel>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: 20,
          textWrap: 'balance'
        }}>
          The earlier you detect,<br/>the more you can do.
        </h2>
        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.7, maxWidth: 640, margin: '0 auto 64px',
          textWrap: 'pretty'
        }}>
          Most dementia research is done on people well past the point where intervention would have mattered most. Early detection flips that — and families hold the earliest clue.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        position: 'relative'
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            padding: '32px 28px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3.2rem, 7vw, 5rem)',
                fontWeight: 400,
                color: 'white',
                lineHeight: 0.9,
                letterSpacing: '-0.03em'
              }}>{s.big}</span>
              {s.unit && (
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{s.unit}</span>
              )}
            </div>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6, marginBottom: 16
            }}>{s.label}</p>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
            <p style={{
              fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '0.15em'
            }}>{s.source}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALISTS
// ═══════════════════════════════════════════════════════════════════════════

function Specialists() {
  const docs = [
    {
      name: 'Dr. Imaad Nasir, M.D.',
      role: 'Neurology',
      inst: 'UCLA Brain Research Institute',
      bio: 'Assistant Clinical Professor at UCLA\'s David Geffen School of Medicine. Specialises in cognitive neurology and brain health across the lifespan.',
      photo: 'https://bri.ucla.edu/wp-content/uploads/2025/03/Nasir_I_Photo.jpg',
    },
    {
      name: 'Dr. Nidhi Goel, MD',
      role: 'Psychiatry',
      inst: 'Healmed Solutions',
      bio: 'Board-certified psychiatrist and founder of Healmed Solutions. Focuses on optimising mental health care delivery and reducing barriers to specialist access.',
      photo: 'https://healmedsolutions.com/wp-content/uploads/2023/07/Doctor-Nidhi-Founder-Healmed-Solutions-300x281-1.jpeg',
    },
  ];

  return (
    <Section id="specialists">
      <div style={{ maxWidth: 720, marginBottom: 56 }}>
        <SectionLabel>White-glove specialist access</SectionLabel>
        <DisplayH2 style={{ marginBottom: 20 }}>
          First-priority access to specialists<br />
          <em>who are typically waitlisted for months.</em>
        </DisplayH2>
        <BodyLead>
          Every CogCare consultation is a dedicated, unhurried 45 minutes with a board-certified specialist — no rushed exams, no six-week follow-ups. CogCare members are seen first, with direct scheduling and a specialist who has already reviewed your full Brain Health Index report before you speak.
        </BodyLead>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        maxWidth: 680,
      }}>
        {docs.map((d) => (
          <div key={d.name} style={{
            background: 'white',
            border: '1px solid var(--color-sand)',
            borderRadius: 24,
            overflow: 'hidden',
            transition: 'transform 0.25s, box-shadow 0.25s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(26,60,52,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ aspectRatio: '4/3.5', overflow: 'hidden', background: 'var(--color-cream)' }}>
              <img src={d.photo} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            </div>
            <div style={{ padding: '20px 22px' }}>
              <h4 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 17, fontWeight: 500,
                color: 'var(--color-forest)',
                marginBottom: 4, letterSpacing: '-0.01em',
                lineHeight: 1.25
              }}>{d.name}</h4>
              <p style={{ fontSize: 12, color: 'var(--color-clay)', fontWeight: 600, marginBottom: 4 }}>{d.role} · {d.inst}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginTop: 8 }}>{d.bio}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Partner logos strip */}
      <div style={{
        marginTop: 72,
        padding: '36px 0',
        borderTop: '1px solid var(--color-sand)',
        borderBottom: '1px solid var(--color-sand)'
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.22em', color: 'var(--color-text-tertiary)',
          textAlign: 'center', marginBottom: 24
        }}>
          Clinical partners & institutional affiliations
        </div>
        <div style={{
          display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {['UCLA HEALTH', 'MAYO CLINIC', 'PENN MEDICINE', 'JOHNS HOPKINS', 'STANFORD'].map(p => (
            <div key={p} style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 17, fontWeight: 500,
              color: 'var(--color-forest)',
              opacity: 0.35,
              letterSpacing: '0.08em'
            }}>{p}</div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export { Nav, Hero, HowItWorks, TheIndex, WhyEarly, Specialists }
