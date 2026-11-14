import { useRef, useState } from 'react'
import { ChoiceCards, Eyebrow } from '../components/ui'
import { lithiumCopy } from '../i18n/lithiumCopy'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'

type Light = 'ok' | 'fix' | 'stop'

export function LithiumCheckPage() {
  const { locale } = useRouter()
  const t = lithiumCopy(locale)
  usePageMeta(t.metaTitle, t.meta)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const answered = t.items.filter((i) => answers[i.id]).length
  const complete = answered === t.items.length

  const rows = t.items.map((i) => ({ item: i, opt: i.options.find((o) => o.value === answers[i.id]) }))
  const stops = rows.filter((r) => r.opt?.light === 'stop')
  const fixes = rows.filter((r) => r.opt?.light === 'fix')
  const overall: Light = stops.length ? 'stop' : fixes.length ? 'fix' : 'ok'
  const verdict = overall === 'ok' ? t.ready : overall === 'fix' ? t.withFixes(fixes.length) : t.blocked

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
          {t.items.map((i, n) => (
            <ChoiceCards<string>
              key={i.id}
              legend={`${n + 1}. ${i.question}`}
              hint={i.hint}
              columns={i.options.length === 2 ? 2 : 3}
              value={answers[i.id] ?? ''}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [i.id]: v }))}
              options={i.options.map((o) => ({ value: o.value, label: o.label }))}
            />
          ))}
          <div className="tool-submit">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!complete}>
              {t.submit}
            </button>
            <span className="muted small" aria-live="polite">
              {complete ? t.done : t.progress(answered, t.items.length)}
            </span>
          </div>
        </form>

        {submitted && complete && (
          <section className="tool-result" aria-labelledby="li-result">
            <div className={`verdict verdict-${overall}`}>
              <span className="verdict-light" aria-hidden="true" />
              <h2 id="li-result" ref={resultRef} tabIndex={-1}>
                {verdict}
              </h2>
            </div>
            <ul className="traffic">
              {[...stops, ...fixes].map(({ item, opt }) =>
                opt ? (
                  <li key={item.id} className={`traffic-row light-${opt.light}`}>
                    <span className="traffic-label">{t.lights[opt.light]}</span>
                    <div>
                      <h3>{item.question}</h3>
                      <p>{opt.advice}</p>
                    </div>
                  </li>
                ) : null,
              )}
            </ul>
            {rows.some((r) => r.opt?.light === 'ok') && (
              <details className="assumptions">
                <summary>
                  <h2>{t.already}</h2>
                </summary>
                <ul className="traffic">
                  {rows
                    .filter((r) => r.opt?.light === 'ok')
                    .map(({ item, opt }) =>
                      opt ? (
                        <li key={item.id} className="traffic-row light-ok">
                          <span className="traffic-label">{t.lights.ok}</span>
                          <div>
                            <h3>{item.question}</h3>
                            <p>{opt.advice}</p>
                          </div>
                        </li>
                      ) : null,
                    )}
                </ul>
              </details>
            )}
            <div className="next-box">
              <h3>{t.sizeTitle}</h3>
              <p>{t.sizeBody}</p>
              <Link href="/configurator" className="btn btn-primary">
                {t.sizeCta}
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
