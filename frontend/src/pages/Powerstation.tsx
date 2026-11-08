import { useRef, useState } from 'react'
import { ChoiceCards, Eyebrow } from '../components/ui'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'

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

function evaluate(a: Required<Answers>) {
  const r: Reason[] = []
  const need = USE_WH[a.use] * STAY_DAYS[a.stay]
  const needText = `${need.toLocaleString('nl-NL')}\u00a0Wh`
  if (need > 2000) r.push({ side: 'fixed', weight: 1.5, text: `Je hebt zo’n ${needText} nodig tussen twee laadmomenten. Een powerstation van die maat weegt al snel meer dan 20 kg en past lastig weg.` })
  if (need <= 1000 && a.use !== 'light') r.push({ side: 'ps', weight: 1, text: `Zo’n ${needText} tussen twee laadmomenten past in een middelgroot powerstation.` })
  if (a.use === 'light') r.push({ side: 'ps', weight: 2, text: 'Je verbruik is laag. Dat past goed in één powerstation.' })
  if (a.use === 'heavy') r.push({ side: 'fixed', weight: 3, text: 'Je verbruik is hoog. Een vaste accu is per kWh flink goedkoper en laadt sneller bij.' })
  if (a.stay === 'one') r.push({ side: 'ps', weight: 1, text: 'Je staat kort vrij. Je hoeft weinig voorraad mee te nemen.' })
  if (a.stay === 'long') r.push({ side: 'fixed', weight: 2, text: 'Je staat lang vrij. Dan heb je zon en laden tijdens het rijden echt nodig.' })
  if (a.modify === 'no') r.push({ side: 'ps', weight: 5, text: 'Je wilt of mag niets aan de camper veranderen. Dan is een powerstation de logische keuze.' })
  if (a.modify === 'rather-not') r.push({ side: 'ps', weight: 1.5, text: 'Je bouwt liever niet. Een powerstation werkt meteen.' })
  if (a.modify === 'yes') r.push({ side: 'fixed', weight: 1, text: 'Je wilt inbouwen. Dan kun je alles op elkaar afstemmen.' })
  if (a.drive === 'lot') r.push({ side: 'fixed', weight: 2.5, text: 'Je rijdt veel. Een DC-DC-lader laadt 30 tot 50 A; via de sigarettenaansteker is dat 8 tot 10 A.' })
  if (a.drive === 'some') r.push({ side: 'fixed', weight: 1, text: 'Je rijdt regelmatig. Met een DC-DC-lader laad je onderweg flink bij.' })
  if (a.drive === 'little') r.push({ side: 'ps', weight: 0.5, text: 'Je rijdt weinig, dus laden tijdens het rijden telt minder.' })
  if (a.portable === 'yes') r.push({ side: 'ps', weight: 2, text: 'Je wilt de accu ook buiten de camper gebruiken.' })
  if (a.portable === 'no') r.push({ side: 'fixed', weight: 0.5, text: 'De accu hoeft de camper niet uit. Inbouwen kost je dus geen flexibiliteit.' })
  if (a.budget === 'low') r.push({ side: 'ps', weight: 1.5, text: 'Met een klein budget is een powerstation de snelste stap. Inbouw kost extra aan kabels, zekeringen en montage.' })
  if (a.budget === 'high') r.push({ side: 'fixed', weight: 1, text: 'Je budget laat een complete installatie toe.' })

  const ps = r.filter((x) => x.side === 'ps').reduce((s, x) => s + x.weight, 0)
  const fixed = r.filter((x) => x.side === 'fixed').reduce((s, x) => s + x.weight, 0)
  // -1 = fully powerstation, +1 = fully fixed
  const lean = (fixed - ps) / Math.max(1, fixed + ps)
  return { reasons: r.sort((x, y) => y.weight - x.weight), lean, need }
}

const QUESTIONS = 6

export function PowerstationPage() {
  usePageMeta(
    'Powerstation of vaste installatie?',
    'Twijfel je tussen een powerstation en een vaste accu-installatie in je camper? Zes vragen, een eerlijk advies met argumenten.',
  )
  const [a, setA] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const answered = Object.values(a).filter(Boolean).length
  const complete = answered === QUESTIONS
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((prev) => ({ ...prev, [k]: v }))
  const res = complete ? evaluate(a as Required<Answers>) : null

  let verdict = ''
  let detail = ''
  if (res) {
    if (res.lean <= -0.25) {
      verdict = 'Een powerstation past bij jou'
      detail = `Kies er een van minstens ${Math.ceil(res.need / 250) * 250} Wh, met LiFePO4-cellen, een zonne-ingang en 12V-laden in de auto.`
    } else if (res.lean >= 0.25) {
      verdict = 'Een vaste installatie past bij jou'
      detail = 'Met een DC-DC-lader, zonnepaneel en een accu op maat ben je het best af. Bereken hieronder wat je nodig hebt.'
    } else {
      verdict = 'Het kan allebei'
      detail =
        'Je zit precies op de grens. Een powerstation dat je vast kunt aansluiten, met een eigen DC-DC-lader, combineert het beste van beide.'
    }
  }
  const pos = res ? ((res.lean + 1) / 2) * 100 : 50

  return (
    <div className="wrap page tool-page">
      <header className="page-head">
        <Eyebrow>Keuzehulp</Eyebrow>
        <h1>Powerstation of vaste installatie?</h1>
        <p className="lead">Zes vragen. Je krijgt een advies met de argumenten erbij, zodat je zelf kunt afwegen.</p>
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
            legend="1. Wat wil je van stroom voorzien?"
            value={a.use as Use}
            onChange={(v) => set('use', v)}
            options={[
              { value: 'light', label: 'Het basale', detail: 'Licht, telefoons, een koelbox' },
              { value: 'medium', label: 'Comfortabel', detail: '+ compressorkoelkast, laptop' },
              { value: 'heavy', label: 'Veel', detail: '+ verwarming, Starlink, koken op stroom' },
            ]}
          />
          <ChoiceCards<Stay>
            legend="2. Hoe lang sta je achter elkaar zonder walstroom?"
            value={a.stay as Stay}
            onChange={(v) => set('stay', v)}
            options={[
              { value: 'one', label: 'Eén nacht' },
              { value: 'few', label: 'Twee tot drie dagen' },
              { value: 'long', label: 'Vier dagen of langer' },
            ]}
          />
          <ChoiceCards<Modify>
            legend="3. Wil je iets aan de camper veranderen?"
            value={a.modify as Modify}
            onChange={(v) => set('modify', v)}
            options={[
              { value: 'yes', label: 'Ja, prima' },
              { value: 'rather-not', label: 'Liever niet' },
              { value: 'no', label: 'Nee', detail: 'Huur, lease of garantie' },
            ]}
          />
          <ChoiceCards<Drive>
            legend="4. Hoeveel rijd je tijdens een reis?"
            value={a.drive as Drive}
            onChange={(v) => set('drive', v)}
            options={[
              { value: 'lot', label: 'Bijna elke dag een stuk' },
              { value: 'some', label: 'Om de paar dagen' },
              { value: 'little', label: 'Weinig, ik sta lang stil' },
            ]}
          />
          <ChoiceCards<Portable>
            legend="5. Wil je de accu ook buiten de camper gebruiken?"
            hint="Thuis, in de tuin, bij stroomuitval of in een andere auto."
            columns={2}
            value={a.portable as Portable}
            onChange={(v) => set('portable', v)}
            options={[
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nee' },
            ]}
          />
          <ChoiceCards<Budget>
            legend="6. Wat is je budget, inclusief installatie?"
            value={a.budget as Budget}
            onChange={(v) => set('budget', v)}
            options={[
              { value: 'low', label: 'Tot € 800' },
              { value: 'mid', label: '€ 800 tot € 2.000' },
              { value: 'high', label: 'Meer dan € 2.000' },
            ]}
          />
          <div className="tool-submit">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!complete}>
              Bekijk het advies
            </button>
            <span className="muted small" aria-live="polite">
              {complete ? 'Alle vragen beantwoord.' : `${answered} van ${QUESTIONS} beantwoord`}
            </span>
          </div>
        </form>

        {submitted && res && (
          <section className="tool-result" aria-labelledby="ps-result">
            <h2 id="ps-result" ref={resultRef} tabIndex={-1}>
              {verdict}
            </h2>
            <div className="lean" role="img" aria-label={`Advies: ${verdict}`}>
              <div className="lean-track">
                <span className="lean-marker" style={{ left: `${pos}%` }} />
              </div>
              <div className="lean-labels">
                <span>Powerstation</span>
                <span>Vaste installatie</span>
              </div>
            </div>
            <p>{detail}</p>
            <p className="muted small">
              Indicatie van je verbruik over een periode zonder laden: ongeveer{' '}
              <strong className="num">{res.need.toLocaleString('nl-NL')} Wh</strong>.
            </p>

            <div className="reasons">
              <div>
                <h3>Voor een powerstation</h3>
                <ul>
                  {res.reasons.filter((x) => x.side === 'ps').map((x) => (
                    <li key={x.text}>{x.text}</li>
                  ))}
                  {!res.reasons.some((x) => x.side === 'ps') && <li className="muted">Geen sterke argumenten.</li>}
                </ul>
              </div>
              <div>
                <h3>Voor een vaste installatie</h3>
                <ul>
                  {res.reasons.filter((x) => x.side === 'fixed').map((x) => (
                    <li key={x.text}>{x.text}</li>
                  ))}
                  {!res.reasons.some((x) => x.side === 'fixed') && <li className="muted">Geen sterke argumenten.</li>}
                </ul>
              </div>
            </div>

            <div className="next-box">
              {res.lean > -0.25 ? (
                <>
                  <h3>Volgende stap</h3>
                  <p>Bereken welke accu, zonnepanelen en laders je nodig hebt, met stuklijst en kabeltabel.</p>
                  <Link href="/configurator" className="btn btn-primary">
                    Bereken je systeem
                  </Link>
                </>
              ) : (
                <>
                  <h3>Waar let je op bij een powerstation?</h3>
                  <p>LiFePO4-cellen, een zonne-ingang van minstens 200 W en een 12V-autolaadkabel.</p>
                  <Link href="/gidsen/powerstation-of-vaste-installatie" className="btn btn-secondary">
                    Lees de gids
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
