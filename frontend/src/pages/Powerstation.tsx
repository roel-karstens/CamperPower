import { useRef, useState } from 'react'
import { ChoiceCards, Eyebrow } from '../components/ui'
import { powerCopy, type PowerCopy } from '../i18n/powerCopy'
import { useFormat } from '../lib/format'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'

type Use = 'light' | 'medium' | 'heavy'
type Stay = 'one' | 'few' | 'long'
type Modify = 'yes' | 'rather-not' | 'no'
type Drive = 'lot' | 'some' | 'little'
type Portable = 'yes' | 'no'
type Budget = 'low' | 'mid' | 'high'

interface Answers {
  use?: Use
  stay?: Stay
  modify?: Modify
  drive?: Drive
  portable?: Portable
  budget?: Budget
}

interface Reason {
  side: 'ps' | 'fixed'
  weight: number
  text: string
}

const USE_WH: Record<Use, number> = { light: 250, medium: 700, heavy: 1500 }
const STAY_DAYS: Record<Stay, number> = { one: 1, few: 2.5, long: 4 }

function evaluate(a: Required<Answers>, say: PowerCopy, wh: (n: number) => string) {
  const r: Reason[] = []
  const need = USE_WH[a.use] * STAY_DAYS[a.stay]
  const needText = `${wh(need)}\u00a0Wh`
  if (need > 2000) r.push({ side: 'fixed', weight: 1.5, text: say.heavyNeed(needText) })
  if (need <= 1000 && a.use !== 'light') r.push({ side: 'ps', weight: 1, text: say.midNeed(needText) })
  if (a.use === 'light') r.push({ side: 'ps', weight: 2, text: say.light })
  if (a.use === 'heavy') r.push({ side: 'fixed', weight: 3, text: say.heavy })
  if (a.stay === 'one') r.push({ side: 'ps', weight: 1, text: say.shortStay })
  if (a.stay === 'long') r.push({ side: 'fixed', weight: 2, text: say.longStay })
  if (a.modify === 'no') r.push({ side: 'ps', weight: 5, text: say.noModify })
  if (a.modify === 'rather-not') r.push({ side: 'ps', weight: 1.5, text: say.ratherNot })
  if (a.modify === 'yes') r.push({ side: 'fixed', weight: 1, text: say.willModify })
  if (a.drive === 'lot') r.push({ side: 'fixed', weight: 2.5, text: say.driveLot })
  if (a.drive === 'some') r.push({ side: 'fixed', weight: 1, text: say.driveSome })
  if (a.drive === 'little') r.push({ side: 'ps', weight: 0.5, text: say.driveLittle })
  if (a.portable === 'yes') r.push({ side: 'ps', weight: 2, text: say.portable })
  if (a.portable === 'no') r.push({ side: 'fixed', weight: 0.5, text: say.notPortable })
  if (a.budget === 'low') r.push({ side: 'ps', weight: 1.5, text: say.budgetLow })
  if (a.budget === 'high') r.push({ side: 'fixed', weight: 1, text: say.budgetHigh })

  const ps = r.filter((x) => x.side === 'ps').reduce((s, x) => s + x.weight, 0)
  const fixed = r.filter((x) => x.side === 'fixed').reduce((s, x) => s + x.weight, 0)
  // -1 = fully powerstation, +1 = fully fixed
  const lean = (fixed - ps) / Math.max(1, fixed + ps)
  return { reasons: r.sort((x, y) => y.weight - x.weight), lean, need }
}

const QUESTIONS = 6

export function PowerstationPage() {
  const { locale } = useRouter()
  const t = powerCopy(locale)
  const { fmt } = useFormat()
  usePageMeta(t.metaTitle, t.meta)
  const [a, setA] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const answered = Object.values(a).filter(Boolean).length
  const complete = answered === QUESTIONS
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((prev) => ({ ...prev, [k]: v }))
  const res = complete ? evaluate(a as Required<Answers>, t, fmt) : null

  let verdict = ''
  let detail = ''
  if (res) {
    if (res.lean <= -0.25) {
      verdict = t.verdictPs
      detail = t.detailPs(Math.ceil(res.need / 250) * 250)
    } else if (res.lean >= 0.25) {
      verdict = t.verdictFixed
      detail = t.detailFixed
    } else {
      verdict = t.verdictBoth
      detail = t.detailBoth
    }
  }
  const pos = res ? ((res.lean + 1) / 2) * 100 : 50

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
          <ChoiceCards<Use>
            legend={t.q1}
            value={a.use as Use}
            onChange={(v) => set('use', v)}
            options={t.use}
          />
          <ChoiceCards<Stay>
            legend={t.q2}
            value={a.stay as Stay}
            onChange={(v) => set('stay', v)}
            options={t.stay}
          />
          <ChoiceCards<Modify>
            legend={t.q3}
            value={a.modify as Modify}
            onChange={(v) => set('modify', v)}
            options={t.modify}
          />
          <ChoiceCards<Drive>
            legend={t.q4}
            value={a.drive as Drive}
            onChange={(v) => set('drive', v)}
            options={t.drive}
          />
          <ChoiceCards<Portable>
            legend={t.q5}
            hint={t.q5hint}
            columns={2}
            value={a.portable as Portable}
            onChange={(v) => set('portable', v)}
            options={[
              { value: 'yes', label: t.yes },
              { value: 'no', label: t.no },
            ]}
          />
          <ChoiceCards<Budget>
            legend={t.q6}
            value={a.budget as Budget}
            onChange={(v) => set('budget', v)}
            options={t.budget}
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

        {submitted && res && (
          <section className="tool-result" aria-labelledby="ps-result">
            <h2 id="ps-result" ref={resultRef} tabIndex={-1}>
              {verdict}
            </h2>
            <p className="lead">{detail}</p>
            <dl className="stats stats-single">
              <div className="is-mark">
                <dt>{t.between}</dt>
                <dd>{fmt(res.need)} Wh</dd>
              </div>
            </dl>
            <p className="source-line">{t.estimate}</p>
            <div className="lean" role="img" aria-label={t.advice(verdict)}>
              <div className="lean-track">
                <span className="lean-marker" style={{ left: `${pos}%` }} />
              </div>
              <div className="lean-labels">
                <span>{t.ps}</span>
                <span>{t.fixed}</span>
              </div>
            </div>
            <div className="reasons">
              <div>
                <h3>{t.forPs}</h3>
                <ul>
                  {res.reasons.filter((x) => x.side === 'ps').map((x) => (
                    <li key={x.text}>{x.text}</li>
                  ))}
                  {!res.reasons.some((x) => x.side === 'ps') && <li className="muted">{t.none}</li>}
                </ul>
              </div>
              <div>
                <h3>{t.forFixed}</h3>
                <ul>
                  {res.reasons.filter((x) => x.side === 'fixed').map((x) => (
                    <li key={x.text}>{x.text}</li>
                  ))}
                  {!res.reasons.some((x) => x.side === 'fixed') && <li className="muted">{t.none}</li>}
                </ul>
              </div>
            </div>

            <div className="next-box">
              {res.lean > -0.25 ? (
                <>
                  <h3>{t.next}</h3>
                  <p>{t.nextBody}</p>
                  <Link href="/configurator" className="btn btn-primary">
                    {t.nextCta}
                  </Link>
                </>
              ) : (
                <>
                  <h3>{t.watch}</h3>
                  <p>{t.watchBody}</p>
                  <Link href="/gidsen/powerstation-of-vaste-installatie" className="btn btn-secondary">
                    {t.read}
                  </Link>
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
