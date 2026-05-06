import { Link } from 'react-router-dom'
import PanelHeader from '../bhi/PanelHeader'
import { FALLBACK_CONSULTANTS } from './consultantsFallback'

function formatApptWhen(startTime, endTime) {
  if (!startTime) return 'Time pending'
  try {
    const s = new Date(startTime)
    if (Number.isNaN(s.getTime())) return 'Time pending'
    const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
    const startStr = s.toLocaleString(undefined, opts)
    if (endTime) {
      const e = new Date(endTime)
      if (!Number.isNaN(e.getTime())) {
        const endStr = e.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
        return `${startStr} – ${endStr}`
      }
    }
    return startStr
  } catch {
    return 'Time pending'
  }
}

export default function ConsultantsTab({ rows, appointments = [] }) {
  const usingFallback = !rows?.length
  const list = usingFallback ? FALLBACK_CONSULTANTS : rows

  const sortedAppts = [...appointments].sort((a, b) => {
    const ta = a?.startTime ? new Date(a.startTime).getTime() : 0
    const tb = b?.startTime ? new Date(b.startTime).getTime() : 0
    return tb - ta
  })

  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Support"
        title="Consultations"
        subtitle="Book a session below. Confirmed bookings from Calendly appear under Your appointments when the webhook is configured."
      />
      {sortedAppts.length ? (
        <div className="rounded-2xl border border-[#E8DCC4] bg-white p-5 shadow-sm">
          <p className="font-serif text-base text-[#3D4B3E]">Your appointments</p>
          <ul className="mt-3 space-y-3">
            {sortedAppts.map((a) => (
              <li
                key={a.calendlyInviteeUri || a.id}
                className="flex flex-col gap-1 border-b border-[#E8DCC4]/80 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {a.eventName?.trim() || 'Consultation'}
                  </p>
                  <p className="text-xs text-[#3D4B3E]/70">{formatApptWhen(a.startTime, a.endTime)}</p>
                </div>
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    a.status === 'canceled'
                      ? 'bg-stone-200/90 text-stone-700'
                      : 'bg-[#3D4B3E]/10 text-[#3D4B3E]'
                  }`}
                >
                  {a.status === 'canceled' ? 'Canceled' : 'Scheduled'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {usingFallback ? (
        <div
          className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950/90"
          role="status"
        >
          Directory not configured — showing sample profiles for layout preview only.
        </div>
      ) : null}
      <div className="grid gap-6 sm:grid-cols-2">
        {list.map((c, i) => (
          <div
            key={c.id ?? c.name + i}
            className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
          >
            {c.photoUrl ? (
              <img src={c.photoUrl} alt="" className="aspect-[4/3] w-full object-cover" />
            ) : null}
            <div className="p-5">
              <p className="font-serif text-lg text-forest">{c.name}</p>
              {c.title ? (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-clay">{c.title}</p>
              ) : null}
              {c.bio ? <p className="mt-3 text-sm leading-relaxed text-forest/85">{c.bio}</p> : null}
              <a
                href={c.bookingUrl || `mailto:${c.contactEmail || ''}`}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-forest px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white sm:min-h-0"
              >
                Request consultation
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
