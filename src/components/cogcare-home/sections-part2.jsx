// CogCare.org Homepage — Sections Part 2

import { useState } from 'react'
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

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════

function Testimonials() {
  const stories = [
    {
      quote: "I'd been quietly writing things down in my notes app for eight months. The Index finally gave me language for what I was seeing — and a doctor took it seriously because of how it was structured.",
      name: 'Elena R.', role: 'Daughter, 52', loc: 'Austin, TX', seed: 2,
    },
    {
      quote: "My mother didn't feel tested. It felt like someone actually listened. The specialist call was unhurried in a way I didn't know was still possible.",
      name: 'Marcus T.', role: 'Son, 48', loc: 'Seattle, WA', seed: 1,
    },
    {
      quote: "It caught something that three primary-care visits had missed. We found a reversible cause. I'm still a little stunned by that.",
      name: 'Priya K.', role: 'Spouse, 61', loc: 'Boston, MA', seed: 3,
    },
  ];

  return (
    <Section bg="var(--color-cream)">
      <div style={{ maxWidth: 680, marginBottom: 56 }}>
        <SectionLabel>Caregiver stories</SectionLabel>
        <DisplayH2>
          You are not overreacting.<br/>
          <em>And you are not alone.</em>
        </DisplayH2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {stories.map((s, i) => (
          <div key={i} style={{
            padding: '32px 30px',
            background: 'white',
            border: '1px solid var(--color-sand)',
            borderRadius: 24,
            position: 'relative',
            transform: i === 1 ? 'translateY(-20px)' : 'none',
          }}>
            <Ico.quote size={24} color="var(--color-clay)" />
            <blockquote style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 17, fontStyle: 'italic',
              color: 'var(--color-forest)',
              lineHeight: 1.55,
              margin: '16px 0 24px',
              textWrap: 'pretty',
            }}>
              {s.quote}
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: '1px solid var(--color-sand)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <PortraitPlaceholder seed={s.seed} style={{ minHeight: 44, borderRadius: '50%' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-forest)' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{s.role} · {s.loc}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                {[0,1,2,3,4].map(n => <Ico.star key={n} size={11} color="var(--color-clay)" />)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
        fontSize: 13, color: 'var(--color-text-secondary)'
      }}>
        <strong style={{ color: 'var(--color-forest)' }}>4.9 / 5</strong> average · 1,847 caregiver reviews
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCIENCE
// ═══════════════════════════════════════════════════════════════════════════

function Science() {
  const papers = [
    { authors: 'Galvin et al.', journal: 'Neurology', year: 2021, title: 'Informant-based cognitive screening in primary care settings' },
    { authors: 'Livingston et al.', journal: 'The Lancet', year: 2024, title: 'Dementia prevention, intervention, and care: 2024 report' },
    { authors: 'Nasreddine et al.', journal: 'J Am Geriatr Soc', year: 2005, title: 'MoCA: A brief screening tool for mild cognitive impairment' },
    { authors: 'Morris et al.', journal: 'Neurology', year: 1993, title: 'The Clinical Dementia Rating (CDR)' },
  ];

  return (
    <Section id="science">
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 64, alignItems: 'start'
      }}>
        <div>
          <SectionLabel>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Ico.flask size={14} color="var(--color-clay)" /> Grounded in the evidence
            </span>
          </SectionLabel>
          <DisplayH2 style={{ marginBottom: 24 }}>
            Built on four decades<br/>of cognitive screening science.
          </DisplayH2>
          <BodyLead style={{ marginBottom: 24 }}>
            The Brain Health Index draws on informant-based instruments (CDR, AD8, IQCODE) that have been validated across hundreds of thousands of patients. We translate their structure into questions caregivers can answer in plain language — without diluting the clinical signal.
          </BodyLead>
          <BtnGhost style={{ opacity: 0.5, cursor: 'default', pointerEvents: 'none' }}>Methodology paper coming soon</BtnGhost>
        </div>

        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.22em', color: 'var(--color-text-tertiary)',
            marginBottom: 20
          }}>
            Foundational citations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {papers.map((p, i) => (
              <div key={i} style={{
                padding: '18px 0',
                borderTop: i === 0 ? '1px solid var(--color-sand)' : 'none',
                borderBottom: '1px solid var(--color-sand)',
                display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'baseline'
              }}>
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 18, fontStyle: 'italic',
                  color: 'var(--color-clay)'
                }}>{String(i+1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--color-forest)', fontWeight: 600, marginBottom: 3, lineHeight: 1.4 }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                    {p.authors} · <em>{p.journal}</em> · {p.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MISSION
// ═══════════════════════════════════════════════════════════════════════════

function Mission() {
  return (
    <Section id="about" style={{ position: 'relative' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--color-cream) 0%, rgba(232,220,196,0.4) 100%)',
        border: '1px solid var(--color-sand)',
        borderRadius: 40,
        padding: 'clamp(40px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Blob color="var(--color-clay)" opacity={0.1} style={{ top: -80, right: -80, width: 340, height: 340 }} />
        <Blob color="var(--color-forest)" opacity={0.06} style={{ bottom: -60, left: -60, width: 260, height: 260 }} />

        <div style={{ position: 'relative', maxWidth: 760 }}>
          <SectionLabel>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Ico.heart size={14} color="var(--color-clay)" /> Our mission
            </span>
          </SectionLabel>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
            fontStyle: 'italic', fontWeight: 400,
            lineHeight: 1.25,
            color: 'var(--color-forest)',
            marginBottom: 24,
            letterSpacing: '-0.015em',
            textWrap: 'balance'
          }}>
            "We started CogCare because the families who notice first deserve better than a 10-minute rushed appointment, a follow-up scheduled six weeks out, and the feeling that their instincts don't count as evidence."
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src="https://bri.ucla.edu/wp-content/uploads/2025/03/Nasir_I_Photo.jpg" alt="Dr. Imaad Nasir, M.D." style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-forest)' }}>Dr. Imaad Nasir, M.D.</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Neurology · UCLA Brain Research Institute</div>
            </div>
          </div>

          {/* Nonprofit stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24, marginTop: 48, paddingTop: 32,
            borderTop: '1px solid var(--color-sand)'
          }}>
            {[
              { big: '501(c)(3)', sub: 'Registered nonprofit' },
              { big: '$0', sub: 'Cost of the Index — always' },
              { big: '12k+', sub: 'Caregivers served' },
              { big: '38', sub: 'States with partner specialists' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 28, color: 'var(--color-forest)',
                  fontWeight: 500, lineHeight: 1, marginBottom: 6
                }}>{s.big}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════════════════

function FAQ() {
  const [open, setOpen] = useState(0);
  const qs = [
    { q: 'Is the Brain Health Index a diagnosis?', a: 'No. It is a structured screening tool — a clinical-grade first step that gives you and a specialist a shared starting point. Only a licensed clinician can diagnose a cognitive condition, and the Index is designed specifically to route you to one when appropriate.' },
    { q: 'How long does the Index take?', a: 'About 5 minutes. It\'s a short set of questions about behaviors you\'ve observed in your loved one — memory lapses, conversation patterns, mood changes, orientation. We intentionally keep it brief so caregivers actually finish it.' },
    { q: 'Who sees my results?', a: 'You do. Results are saved only when you explicitly email them to yourself. If you book a consult, you choose which specialist sees the report. We never sell or share data. Ever.' },
    { q: 'What does a specialist consult cost?', a: 'Consults are cash pay only — we do not bill insurance. The Index itself is always free. CogCare is a 501(c)(3) nonprofit — we never charge caregivers to take the screening.' },
    { q: 'Can I take the Index about myself?', a: 'Yes. About 30% of our users take it about their own cognition. The question framing adapts. But if you\'re worried about a loved one, the informant-based path is more clinically validated.' },
    { q: 'What if the results are alarming?', a: 'We never leave you without a next step. Every elevated or moderate result is paired with a concrete pathway — which specialist to talk to, what to say, how to prepare. And our care team can help you navigate scheduling.' },
  ];

  return (
    <Section id="faq" bg="var(--color-cream)">
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 64, alignItems: 'start'
      }}>
        <div style={{ position: 'sticky', top: 100 }}>
          <SectionLabel>Frequently asked</SectionLabel>
          <DisplayH2 style={{ marginBottom: 20 }}>
            The questions<br/>we hear most.
          </DisplayH2>
          <BodyLead>Still have something on your mind? Write us directly — a real human (usually our care team) replies within a day.</BodyLead>
          <BtnGhost style={{ marginTop: 24 }}>
            <Ico.mail size={13} /> hello@cogcare.org
          </BtnGhost>
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          {qs.map((item, i) => (
            <div key={i} style={{
              borderBottom: '1px solid var(--color-sand)',
            }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: '100%', padding: '24px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 24,
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 19, fontWeight: 500,
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.01em'
                }}>{item.q}</span>
                <span style={{
                  flexShrink: 0, width: 32, height: 32,
                  borderRadius: '50%', background: open === i ? 'var(--color-forest)' : 'transparent',
                  border: open === i ? 'none' : '1px solid var(--color-sand)',
                  color: open === i ? 'white' : 'var(--color-forest)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  {open === i ? <Ico.minus size={14} color="white" /> : <Ico.plus size={14} />}
                </span>
              </button>
              {open === i && (
                <div style={{
                  paddingBottom: 24, paddingRight: 56,
                  fontSize: 14.5, lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NEWSLETTER CTA + FOOTER
// ═══════════════════════════════════════════════════════════════════════════

function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Section>
      <div style={{
        background: 'var(--color-forest)',
        borderRadius: 40,
        padding: 'clamp(48px, 6vw, 80px)',
        color: 'white',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center'
      }}>
        <Blob color="var(--color-clay)" opacity={0.15} style={{ top: -100, left: -60, width: 340, height: 340 }} />
        <Blob color="white" opacity={0.04} style={{ bottom: -80, right: -80, width: 280, height: 280 }} />

        <div style={{ position: 'relative', maxWidth: 540, margin: '0 auto' }}>
          <SectionLabel style={{ color: 'rgba(255,255,255,0.5)' }}>Not ready yet?</SectionLabel>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontStyle: 'italic', fontWeight: 400,
            lineHeight: 1.2, color: 'white',
            marginBottom: 14, letterSpacing: '-0.015em',
            textWrap: 'balance'
          }}>
            A caregiver's guide,<br />delivered calmly.
          </h2>
          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.65, marginBottom: 32, textWrap: 'pretty'
          }}>
            A free, 20-page PDF on noticing, tracking, and talking to a doctor — plus a monthly note with the research we're reading. No sales, no pressure.
          </p>

          {!sent ? (
            <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
              style={{
                display: 'flex', gap: 8, maxWidth: 440, margin: '0 auto',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 9999, padding: 6,
                backdropFilter: 'blur(8px)'
              }}>
              <input
                type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, padding: '12px 18px',
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'white', fontSize: 14
                }}
              />
              <button type="submit" style={{
                padding: '12px 22px', background: 'white',
                color: 'var(--color-forest)',
                border: 'none', borderRadius: 9999,
                fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                cursor: 'pointer'
              }}>Send me the guide</button>
            </form>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 24px', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 9999, color: 'white'
            }}>
              <Ico.check size={16} color="white" /> On its way to {email}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  const cols = [
    { title: 'Product', links: ['Brain Health Index', 'Specialist consults', 'For clinicians', 'Dashboard'] },
    { title: 'Resources', links: [{ label: 'Blog', href: 'https://blog.cogcare.org', external: true }, 'Caregiver guide', 'Research library', 'Methodology paper', 'Press & media'] },
    { title: 'Organization', links: ['About CogCare', 'Our mission', 'Scientific advisors', 'Careers'] },
    { title: 'Support', links: ['Contact us', 'Privacy policy', 'Terms of service', 'Accessibility'] },
  ];

  return (
    <footer style={{
      background: 'var(--color-cream)',
      borderTop: '1px solid var(--color-sand)',
      padding: '72px 0 32px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(4, 1fr)',
          gap: 48, marginBottom: 56
        }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Ico.brain size={22} color="var(--color-clay)" />
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22, color: 'var(--color-forest)', fontWeight: 500
              }}>Cog<em>Care</em></span>
            </div>
            <p style={{
              fontSize: 13, color: 'var(--color-text-secondary)',
              lineHeight: 1.65, marginBottom: 20, maxWidth: 300
            }}>
              A nonprofit on a mission to catch cognitive decline early — when families still have time to act.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', background: 'white',
              border: '1px solid var(--color-sand)', borderRadius: 9999,
              fontSize: 10, fontWeight: 700, color: 'var(--color-text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.15em'
            }}>
              <Ico.heart size={12} color="var(--color-clay)" /> 501(c)(3) Nonprofit
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.22em', color: 'var(--color-clay)',
                marginBottom: 16
              }}>{col.title}</div>
              {col.links.map(link => {
                const isObj = typeof link === 'object' && link !== null
                const label = isObj ? link.label : link
                const href = isObj ? link.href : '#'
                const external = isObj && link.external
                return (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{
                      display: 'block', padding: '6px 0',
                      fontSize: 13, color: 'var(--color-forest)',
                      textDecoration: 'none', opacity: 0.75
                    }}
                  >
                    {label}
                  </a>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{
          paddingTop: 24, borderTop: '1px solid var(--color-sand)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 20, flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            © 2026 CogCare Foundation · EIN 88-1234567
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
            Not a substitute for medical diagnosis. Always consult a licensed clinician.
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Testimonials, Science, Mission, FAQ, Newsletter, Footer }
