import { useRef, useState } from 'react'
import { ChoiceCards, Eyebrow } from '../components/ui'
import { accuCopy, type AccuCopy } from '../i18n/accuCopy'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'

type When = 'night' | 'days' | 'driving' | 'storage'
type Kind = 'lead' | 'lithium' | 'unknown'
type Age = 'new' | 'mid' | 'old' | 'unknown'
type DriveCharge = 'yes' | 'little' | 'unknown'
type Year = 'pre2015' | 'post2015' | 'unknown'
type Solar = 'none' | 'small' | 'large'
type Inverter = 'off' | 'on' | 'none'

interface Answers {
  when?: When
  kind?: Kind
  age?: Age
  drive?: DriveCharge
  year?: Year
  solar?: Solar
  inverter?: Inverter
}

interface Cause {
  id: string
  title: string
  score: number
  why: string
  fix: string[]
  link?: { href: string; label: string }
}

function diagnose(a: Required<Answers>, text: AccuCopy): Cause[] {
  const causes: Cause[] = []

  // 1. Battery worn out (lead) – typically "empty after one night".
  let aging = 0
  if (a.kind !== 'lithium') {
    if (a.age === 'old') aging += 3
    if (a.age === 'mid') aging += 1.5
    if (a.age === 'unknown') aging += 1
    if (a.when === 'night') aging += 2
  }
  causes.push({ id: 'aging', score: aging, ...text.causes.aging })

  // 2. Not charging while driving.
  let drive = 0
  if (a.when === 'driving') drive += 3
  if (a.drive === 'little') drive += 3
  if (a.drive === 'unknown') drive += 1
  if (a.year === 'post2015' && a.drive !== 'yes') drive += 2
  if (a.kind === 'lithium' && a.drive !== 'yes') drive += 1
  causes.push({ id: 'drive', score: drive, ...text.causes.drive })

  // 3. Inverter idle draw.
  let idle = 0
  if (a.inverter === 'on') idle += 3
  if (a.inverter === 'on' && (a.when === 'night' || a.when === 'days')) idle += 1
  causes.push({ id: 'idle', score: idle, ...text.causes.idle })

  // 4. Consumption larger than what the battery + charging can supply.
  let capacity = 0
  if (a.when === 'days') capacity += 3
  if (a.when === 'night') capacity += 1
  if (a.solar === 'none') capacity += 2
  if (a.solar === 'small') capacity += 1
  if (a.kind === 'lead') capacity += 1
  causes.push({ id: 'capacity', score: capacity, ...text.causes.capacity })

  // 5. Parasitic drain during storage.
  let parasitic = 0
  if (a.when === 'storage') parasitic += 4
  causes.push({ id: 'parasitic', score: parasitic, ...text.causes.parasitic })

  // 6. Lithium never fully charged.
  let lithium = 0
  if (a.kind === 'lithium') {
    lithium += 2
    if (a.when === 'night' || a.when === 'days') lithium += 1
  }
  causes.push({ id: 'lithium', score: lithium, ...text.causes.lithium })

  return causes.filter((c) => c.score > 0).sort((x, y) => y.score - x.score)
}

function likelihood(score: number, top: number, first: boolean, text: AccuCopy): { label: string; cls: string } {
  const r = score / top
  if (r >= 0.75) return { label: first ? text.likely : text.also, cls: 'high' }
  if (r >= 0.4) return { label: text.possible, cls: 'mid' }
  return { label: text.less, cls: 'low' }
}

const QUESTIONS = 7

export function AccuLeegPage() {
  const { locale } = useRouter()
  const t = accuCopy(locale)
  usePageMeta(t.metaTitle, t.meta)
  const [a, setA] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const answered = Object.values(a).filter(Boolean).length
  const complete = answered === QUESTIONS
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((prev) => ({ ...prev, [k]: v }))
  const causes = complete ? diagnose(a as Required<Answers>, t) : []
  const top = causes[0]?.score ?? 1

  return (
    <div className="wrap page tool-page">
      <header className="page-head">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>
      </header>

      <div className="tool-layout">
        <form
          className="tool-form"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
            requestAnimationFrame(() => resultRef.current?.focus())
          }}
        >
          <h2 className="form-group">{t.groups.happens}</h2>
          <ChoiceCards<When>
            legend={t.q1}
            columns={2}
            value={a.when as When}
            onChange={(v) => set('when', v)}
            options={t.when}
          />
          <ChoiceCards<Kind>
            legend={t.q2}
            value={a.kind as Kind}
            onChange={(v) => set('kind', v)}
            options={t.kind}
          />
          <ChoiceCards<Age>
            legend={t.q3}
            columns={4}
            value={a.age as Age}
            onChange={(v) => set('age', v)}
            options={t.age}
          />
          <h2 className="form-group">{t.groups.charge}</h2>
          <ChoiceCards<DriveCharge>
            legend={t.q4}
            hint={t.q4hint}
            value={a.drive as DriveCharge}
            onChange={(v) => set('drive', v)}
            options={t.drive}
          />
          <ChoiceCards<Year>
            legend={t.q5}
            hint={t.q5hint}
            value={a.year as Year}
            onChange={(v) => set('year', v)}
            options={t.year}
          />
          <ChoiceCards<Solar>
            legend={t.q6}
            value={a.solar as Solar}
            onChange={(v) => set('solar', v)}
            options={t.solar}
          />
          <h2 className="form-group">{t.groups.inverter}</h2>
          <ChoiceCards<Inverter>
            legend={t.q7}
            value={a.inverter as Inverter}
            onChange={(v) => set('inverter', v)}
            options={t.inverter}
          />
          <div className="tool-submit">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!complete}>
              {t.submit}
            </button>
            <span className="muted small" aria-live="polite">
              {complete ? t.done : t.progress(answered, QUESTIONS)}
            </span>
          </div>
        </form>

        {submitted && complete && causes[0] && (
          <section className="tool-result" aria-labelledby="diag-result">
            <p className="eyebrow">{t.likely}</p>
            <h2 id="diag-result" ref={resultRef} tabIndex={-1}>
              {causes[0].title}
            </h2>
            <p className="lead">{causes[0].why}</p>
            <h3>{t.what}</h3>
            <ul>
              {causes[0].fix.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {causes[0].link && (
              <Link href={causes[0].link.href} className="text-link">
                {causes[0].link.label} →
              </Link>
            )}
            {causes.length > 1 && (
              <details className="assumptions">
                <summary>
                  <h2>{t.others}</h2>
                </summary>
                <ol className="causes">
                  {causes.slice(1).map((c) => {
                    const l = likelihood(c.score, top, false, t)
                    return (
                      <li key={c.id} className={`cause cause-${l.cls}`}>
                        <div className="cause-head">
                          <h3>{c.title}</h3>
                          <span className={`pill pill-${l.cls}`}>{l.label}</span>
                        </div>
                        <p>{c.why}</p>
                        <h4>{t.what}</h4>
                        <ul>
                          {c.fix.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                        {c.link && (
                          <Link href={c.link.href} className="text-link">
                            {c.link.label} →
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </details>
            )}
            <div className="next-box">
              <h3>{t.fixTitle}</h3>
              <p>{t.fixBody}</p>
              <Link href="/configurator" className="btn btn-primary">
                {t.fixCta}
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
