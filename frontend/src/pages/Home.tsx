import { useMemo } from 'react'
import { EnergyChart, SystemDiagram } from '../components/charts'
import { Photo } from '../components/Photo'
import { Eyebrow } from '../components/ui'
import { GUIDES } from '../data/guides'
import { IMAGES } from '../data/images'
import { calculate } from '../lib/calc'
import { initialState } from '../lib/configState'
import { fmt, kwh } from '../lib/format'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { MONTHS_SHORT, NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'

const ENTRY_POINTS = [
  {
    href: '/accu-leeg',
    q: 'Mijn accu is steeds leeg',
    a: 'Vind in zeven vragen de waarschijnlijke oorzaak, en wat je eraan doet.',
    cta: 'Start de diagnose',
  },
  {
    href: '/powerstation-of-vast',
    q: 'Powerstation of vaste installatie?',
    a: 'Een eerlijke afweging op verbruik, laden onderweg en budget.',
    cta: 'Maak de keuze',
  },
  {
    href: '/configurator',
    q: 'Hoeveel accu en zon heb ik nodig?',
    a: 'Vier stappen. Je krijgt een systeemschema, stuklijst en kabeltabel.',
    cta: 'Bereken je systeem',
  },
  {
    href: '/lithium-check',
    q: 'Kan lithium in mijn oude camper?',
    a: 'Check of je EBL, lader en dynamo geschikt zijn voor LiFePO4.',
    cta: 'Doe de check',
  },
]

export function HomePage() {
  usePageMeta(
    'CamperPower',
    'Bereken welke accu, zonnepanelen en laders je camper nodig heeft. Onafhankelijk, met Nederlandse zondata, een stuklijst en veiligheidschecks.',
  )
  const example = useMemo(() => {
    const s = initialState('tour')
    return { state: s, result: calculate(s) }
  }, [])
  const maxH = Math.max(...NL_IRRADIATION)

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <Eyebrow>Stroom in je camper</Eyebrow>
            <h1>Weet wat je camper nodig heeft, vóór je iets koopt.</h1>
            <p className="lead">
              Bereken welke accu, zonnepanelen en laders passen bij hoe jij reist. Met Nederlandse zondata, een complete
              stuklijst en de checks die een vakman ook doet.
            </p>
            <div className="hero-actions">
              <Link href="/configurator" className="btn btn-primary btn-lg">
                Bereken je systeem
              </Link>
              <Link href="/accu-leeg" className="btn btn-secondary btn-lg">
                Accu steeds leeg?
              </Link>
            </div>
            <ul className="hero-proof">
              <li>Gratis, zonder account</li>
              <li>Geen cookies</li>
              <li>Formules openbaar</li>
            </ul>
          </div>
          <Photo image={IMAGES.hero} priority sizes="(min-width: 960px) 46vw, 100vw" className="hero-photo" />
        </div>
      </section>

      <section className="section" aria-labelledby="h-start">
        <div className="wrap">
          <div className="section-head">
            <h2 id="h-start">Waar wil je mee beginnen?</h2>
            <p>Iedereen komt met een andere vraag. Kies de jouwe.</p>
          </div>
          <div className="card-grid cols-4">
            {ENTRY_POINTS.map((e) => (
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
          <div className="section-head">
            <Eyebrow>Voorbeeld</Eyebrow>
            <h2 id="h-example">Zo ziet een uitkomst eruit</h2>
            <p>
              Een stel op rondreis door Europa, van mei tot september. Koelkast, laptop, dakventilator. Samen{' '}
              <strong>{kwh(example.result.dailyWh)}</strong> per dag.
            </p>
          </div>
          <div className="example-grid">
            <div className="panel">
              <h3 className="panel-title">Het systeem</h3>
              <SystemDiagram result={example.result} />
            </div>
            <div className="panel">
              <h3 className="panel-title">Energiebalans per maand</h3>
              <EnergyChart
                monthly={example.result.monthly}
                travel={example.state.months}
                designMonth={example.result.solar.designMonth}
              />
            </div>
          </div>
          <div className="center">
            <Link href="/configurator" className="btn btn-primary">
              Maak je eigen berekening
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="h-sun">
        <div className="wrap split">
          <div>
            <Eyebrow>Zon in Nederland</Eyebrow>
            <h2 id="h-sun">In december levert je paneel een tiende van juli</h2>
            <p>
              Een zonnepaneel van 100 Wp, plat op het dak, levert in juli gemiddeld{' '}
              <strong className="num">{fmt(100 * NL_IRRADIATION[6] * PERFORMANCE_RATIO)} Wh</strong> per dag. In december is
              dat <strong className="num">{fmt(100 * NL_IRRADIATION[11] * PERFORMANCE_RATIO)} Wh</strong>. Wie ook in het
              voor- of najaar reist, heeft meer paneel nodig, of laadt bij tijdens het rijden.
            </p>
            <p className="muted small">
              Bron: PVGIS (Europese Commissie), De Bilt, gemiddelde 2013–2020. <Link href="/methode">Zo rekenen wij</Link>.
            </p>
          </div>
          <figure className="sun-bars" aria-label="Opbrengst per dag van 100 Wp per maand">
            {NL_IRRADIATION.map((h, i) => (
              <div key={i} className="sun-row">
                <span className="sun-month">{MONTHS_SHORT[i]}</span>
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
          <Photo image={IMAGES.departure} sizes="(min-width: 960px) 40vw, 100vw" />
          <div>
            <Eyebrow>Hoe wij werken</Eyebrow>
            <h2 id="h-how">Rekenen zoals een vakman, uitleggen zoals een buurman</h2>
            <ol className="steps">
              <li>
                <h3>Echte data, geen vuistregels</h3>
                <p>Zonopbrengst per maand uit PVGIS. Kabeldikte op spanningsval én stroom. Zekeringen die bij de kabel passen.</p>
              </li>
              <li>
                <h3>Alles is na te rekenen</h3>
                <p>Elke formule en aanname staat op de methodepagina. Klopt er iets niet? Dan passen we het aan.</p>
              </li>
              <li>
                <h3>Onafhankelijk</h3>
                <p>We verkopen niets. Gaan we ooit naar winkels linken, dan staat dat er altijd bij.</p>
              </li>
            </ol>
            <Link href="/methode" className="text-link">
              Lees hoe we rekenen →
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="h-guides">
        <div className="wrap">
          <div className="section-head row">
            <div>
              <h2 id="h-guides">Begrijp wat je koopt</h2>
              <p>Korte gidsen zonder jargon, met de getallen die ertoe doen.</p>
            </div>
            <Link href="/gidsen" className="text-link">
              Alle gidsen →
            </Link>
          </div>
          <div className="card-grid cols-3">
            {GUIDES.slice(0, 6).map((g) => (
              <Link key={g.slug} href={`/gidsen/${g.slug}`} className="card card-link">
                <span className="card-meta">{g.minutes} min lezen</span>
                <span className="card-title">{g.title}</span>
                <span className="card-text">{g.summary}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>Klaar om te rekenen?</h2>
            <p>Vier stappen. Je uitkomst blijft bewaard op dit apparaat en kun je delen.</p>
          </div>
          <Link href="/configurator" className="btn btn-accent btn-lg">
            Bereken je systeem
          </Link>
        </div>
      </section>
    </>
  )
}
