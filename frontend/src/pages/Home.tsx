import { useMemo } from 'react'
import { EnergyChart, SystemDiagram } from '../components/charts'
import { GuideReel } from '../components/GuideReel'
import { CoverPhoto, Photo } from '../components/Photo'
import { Eyebrow } from '../components/ui'
import { useGuides } from '../data/guides'
import { IMAGES } from '../data/images'
import { homeCopy } from '../i18n/homeCopy'
import { monthNames } from '../i18n/months'
import { calculate } from '../lib/calc'
import { initialState } from '../lib/configState'
import { useFormat } from '../lib/format'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'
import { NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'

export function HomePage() {
  const { locale } = useRouter()
  const t = homeCopy(locale)
  const { fmt, fmt1, kwh } = useFormat()
  const guides = useGuides()
  const months = monthNames(locale)
  usePageMeta(t.metaTitle, t.meta)
  const example = useMemo(() => {
    const s = initialState('tour')
    return { state: s, result: calculate(s, locale) }
  }, [locale])
  const maxH = Math.max(...NL_IRRADIATION)
  const july = 100 * NL_IRRADIATION[6] * PERFORMANCE_RATIO
  const december = 100 * NL_IRRADIATION[11] * PERFORMANCE_RATIO

  return (
    <>
      <section className="hero-bleed">
        <CoverPhoto image={IMAGES.hero} className="hero-media" priority sizes="100vw" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-copy">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1>{t.h1}</h1>
          <p className="lead">{t.lead}</p>
          <div className="hero-actions">
            <Link href="/configurator" className="btn btn-primary btn-lg">
              {t.cta}
            </Link>
            <Link href="/accu-leeg" className="btn btn-secondary btn-lg">
              {t.flat}
            </Link>
          </div>
          <ul className="hero-proof">
            {t.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="h-start">
        <div className="wrap">
          <div className="section-head">
            <h2 id="h-start">{t.startTitle}</h2>
            <p>{t.startLead}</p>
          </div>
          <div className="card-grid cols-4">
            {t.entries.map((e) => (
              <Link key={e.href} href={e.href} className="card card-link entry">
                <span className="card-title">{e.q}</span>
                <span className="card-text">{e.a}</span>
                <span className="card-cta">{e.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="h-example">
        <div className="wrap">
          <div className="story">
            <Photo image={IMAGES.couple} sizes="(min-width: 960px) 38vw, 100vw" className="story-photo" />
            <div>
              <Eyebrow>{t.exampleEyebrow}</Eyebrow>
              <h2 id="h-example">{t.exampleTitle}</h2>
              <p>
                {t.exampleBefore}
                <strong>{kwh(example.result.dailyWh)}</strong>
                {t.exampleAfter}
              </p>
              <dl className="stats">
                <div>
                  <dt>{t.useLabel}</dt>
                  <dd>{kwh(example.result.dailyWh)}</dd>
                </div>
                <div className="is-mark">
                  <dt>{t.batteryLabel}</dt>
                  <dd>{fmt(example.result.battery.ah)} Ah</dd>
                </div>
                <div>
                  <dt>{t.solarLabel}</dt>
                  <dd>{fmt(example.result.solar.wp)} Wp</dd>
                </div>
              </dl>
              <p className="source-line">
                {t.source} <Link href="/methode">{t.method}</Link>.
              </p>
            </div>
          </div>
          <div className="example-grid">
            <div className="panel">
              <h3 className="panel-title">{t.system}</h3>
              <SystemDiagram result={example.result} />
            </div>
            <div className="panel">
              <h3 className="panel-title">{t.balance}</h3>
              <EnergyChart
                monthly={example.result.monthly}
                travel={example.state.months}
                designMonth={example.result.solar.designMonth}
              />
            </div>
          </div>
          <div className="center">
            <Link href="/configurator" className="btn btn-primary">
              {t.own}
            </Link>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="h-days">
        <CoverPhoto image={IMAGES.night} className="band-media" sizes="100vw" />
        <div className="band-scrim" aria-hidden="true" />
        <div className="wrap band-copy">
          <Eyebrow>{t.offgrid}</Eyebrow>
          <p className="band-stat" id="h-days">
            {fmt1(example.result.battery.daysWithoutCharging)} {t.daysAfter}
          </p>
          <p>{t.daysBody}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-sun">
        <div className="wrap split">
          <div>
            <Eyebrow>{t.sunEyebrow}</Eyebrow>
            <h2 id="h-sun">{t.sunTitle}</h2>
            <dl className="stats">
              <div className="is-mark">
                <dt>{t.july}</dt>
                <dd>{fmt(july)} Wh</dd>
              </div>
              <div>
                <dt>{t.december}</dt>
                <dd>{fmt(december)} Wh</dd>
              </div>
            </dl>
            <p>{t.sunBody}</p>
            <p className="source-line">
              {t.sunSource} <Link href="/methode">{t.method}</Link>.
            </p>
          </div>
          <Photo image={IMAGES.solarRoof} sizes="(min-width: 960px) 46vw, 100vw" />
        </div>
        <div className="wrap">
          <figure className="sun-bars" aria-label={t.sunChart}>
            {NL_IRRADIATION.map((h, i) => (
              <div key={i} className="sun-row">
                <span className="sun-month">{months.short[i]}</span>
                <span className="sun-track">
                  <span className="sun-fill" style={{ width: `${(h / maxH) * 100}%` }} />
                </span>
                <span className="sun-val num">{fmt(100 * h * PERFORMANCE_RATIO)} Wh</span>
              </div>
            ))}
          </figure>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="h-how">
        <div className="wrap split split-photo">
          <Photo image={IMAGES.interior} sizes="(min-width: 960px) 40vw, 100vw" />
          <div>
            <Eyebrow>{t.howEyebrow}</Eyebrow>
            <h2 id="h-how">{t.howTitle}</h2>
            <ol className="steps">
              {t.steps.map((step) => (
                <li key={step.h}>
                  <h3>{step.h}</h3>
                  <p>{step.p}</p>
                </li>
              ))}
            </ol>
            <Link href="/methode" className="text-link">
              {t.howLink} →
            </Link>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="h-nl">
        <CoverPhoto image={IMAGES.forest} className="band-media" sizes="100vw" />
        <div className="band-scrim" aria-hidden="true" />
        <div className="wrap band-copy">
          <p className="band-title" id="h-nl">
            {t.placeTitle}
          </p>
          <p>{t.placeBody}</p>
          <Link href="/methode" className="text-link">
            {t.placeLink} →
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="h-guides">
        <div className="wrap">
          <div className="section-head row">
            <div>
              <h2 id="h-guides">{t.guidesTitle}</h2>
              <p>{t.guidesLead}</p>
            </div>
            <Link href="/gidsen" className="text-link">
              {t.allGuides} →
            </Link>
          </div>
          <GuideReel
            guides={guides}
            minutes={t.minutes}
            label={t.reelLabel}
            prevLabel={t.reelPrev}
            nextLabel={t.reelNext}
          />
        </div>
      </section>

      <section className="band" aria-labelledby="h-cta">
        <CoverPhoto image={IMAGES.vintage} className="band-media" sizes="100vw" />
        <div className="band-scrim" aria-hidden="true" />
        <div className="wrap band-copy">
          <h2 id="h-cta">{t.ctaTitle}</h2>
          <p>{t.ctaBody}</p>
          <Link href="/configurator" className="btn btn-primary btn-lg">
            {t.cta}
          </Link>
        </div>
      </section>
    </>
  )
}
