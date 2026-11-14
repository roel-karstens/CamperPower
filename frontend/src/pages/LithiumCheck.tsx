import { useRef, useState } from 'react'
import { ChoiceCards, Eyebrow } from '../components/ui'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'

type Light = 'ok' | 'fix' | 'stop'

interface Item {
  id: string
  question: string
  hint?: string
  options: { value: string; label: string; light: Light; advice: string }[]
}

const ITEMS: Item[] = [
  {
    id: 'mix',
    question: 'Blijft er een loodaccu (AGM, gel) als woonaccu naast de lithium?',
    options: [
      { value: 'no', label: 'Nee, ik vervang hem', light: 'ok', advice: 'Goed. Eén accutype per accupakket.' },
      { value: 'yes', label: 'Ja, ze komen naast elkaar', light: 'stop', advice: 'Niet doen. Lood en lithium parallel laden en ontladen verschillend. De loodaccu wordt overladen of de lithium nooit vol.' },
    ],
  },
  {
    id: 'shore',
    question: 'Heeft je walstroomlader of EBL een LiFePO4-stand?',
    hint: 'Kijk op het typeplaatje en zoek de handleiding op.',
    options: [
      { value: 'yes', label: 'Ja', light: 'ok', advice: 'Zet hem op LiFePO4 en controleer de laadspanning: 14,2 tot 14,4 V.' },
      { value: 'no', label: 'Nee', light: 'fix', advice: 'Schakel de interne lader uit en plaats een losse lader met LiFePO4-profiel.' },
      { value: 'unknown', label: 'Weet ik niet', light: 'fix', advice: 'Zoek het type op. Bij twijfel: vraag het de fabrikant voor je de accu aansluit.' },
    ],
  },
  {
    id: 'drive',
    question: 'Hoe laadt de woonaccu tijdens het rijden?',
    options: [
      { value: 'dcdc', label: 'Via een DC-DC-lader', light: 'ok', advice: 'Goed. Zet hem op LiFePO4 en controleer of hij op het motorsignaal (D+) schakelt.' },
      { value: 'relay', label: 'Via relais of EBL', light: 'fix', advice: 'Lithium trekt te veel stroom uit de dynamo. Plaats een DC-DC-lader van 20 tot 30% van de accucapaciteit.' },
      { value: 'unknown', label: 'Weet ik niet', light: 'fix', advice: 'Volg de kabel vanaf de startaccu. Zit er geen DC-DC-lader tussen, dan is dat waarschijnlijk nodig.' },
    ],
  },
  {
    id: 'solar',
    question: 'Heeft je zonneregelaar een LiFePO4-stand?',
    options: [
      { value: 'yes', label: 'Ja', light: 'ok', advice: 'Zet hem op LiFePO4 en zet druppelladen (float) laag of uit.' },
      { value: 'no', label: 'Nee', light: 'fix', advice: 'Vervang de regelaar door een MPPT-regelaar met instelbaar profiel.' },
      { value: 'none', label: 'Geen zonnepaneel', light: 'ok', advice: 'Niets te doen.' },
    ],
  },
  {
    id: 'cold',
    question: 'Waar komt de accu te staan?',
    hint: 'LiFePO4 mag niet laden onder 0 °C.',
    options: [
      { value: 'inside', label: 'Binnen, in de woonruimte', light: 'ok', advice: 'Goed. Daar wordt het bij gebruik zelden kouder dan 0 °C.' },
      { value: 'outside', label: 'Buiten of onder de vloer', light: 'fix', advice: 'Kies een accu met ingebouwde verwarming of een BMS dat laden onder 0 °C blokkeert.' },
    ],
  },
  {
    id: 'fuse',
    question: 'Zit er een hoofdzekering vlak bij de accu?',
    options: [
      { value: 'yes', label: 'Ja', light: 'ok', advice: 'Controleer of hij past bij de dikste kabel en binnen 20 cm van de pluspool zit.' },
      { value: 'no', label: 'Nee', light: 'stop', advice: 'Plaats een hoofdzekering (bijvoorbeeld MEGA of ANL) direct bij de pluspool. Een lithiumaccu kan duizenden ampères leveren.' },
      { value: 'unknown', label: 'Weet ik niet', light: 'fix', advice: 'Controleer het voor je gaat rijden.' },
    ],
  },
  {
    id: 'monitor',
    question: 'Heb je een accumonitor met shunt, of een BMS met app?',
    hint: 'Lithium houdt de spanning lang gelijk. Aan de spanning zie je niet hoe vol hij is.',
    options: [
      { value: 'yes', label: 'Ja', light: 'ok', advice: 'Goed. Stel de capaciteit in op die van de nieuwe accu.' },
      { value: 'no', label: 'Nee', light: 'fix', advice: 'Kies een accu met Bluetooth-BMS of plaats een shunt. Anders weet je niet hoeveel er nog in zit.' },
    ],
  },
]

const LIGHT_LABEL: Record<Light, string> = { ok: 'In orde', fix: 'Aanpassen', stop: 'Eerst oplossen' }

export function LithiumCheckPage() {
  usePageMeta(
    'Lithium-check: kan LiFePO4 in jouw camper?',
    'Controleer in zeven vragen of je laders, dynamo en installatie klaar zijn voor een LiFePO4-accu. Met een actielijst per punt.',
  )
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const answered = ITEMS.filter((i) => answers[i.id]).length
  const complete = answered === ITEMS.length

  const rows = ITEMS.map((i) => ({ item: i, opt: i.options.find((o) => o.value === answers[i.id]) }))
  const stops = rows.filter((r) => r.opt?.light === 'stop')
  const fixes = rows.filter((r) => r.opt?.light === 'fix')
  const overall: Light = stops.length ? 'stop' : fixes.length ? 'fix' : 'ok'
  const verdict =
    overall === 'ok'
      ? 'Je camper is klaar voor lithium'
      : overall === 'fix'
        ? `Lithium kan, met ${fixes.length} ${fixes.length === 1 ? 'aanpassing' : 'aanpassingen'}`
        : 'Los eerst dit op voor je lithium aansluit'

  return (
    <div className="wrap page tool-page">
      <header className="page-head">
        <Eyebrow>Check</Eyebrow>
        <h1>Kan lithium in jouw camper?</h1>
        <p className="lead">
          Een LiFePO4-accu is lichter en gaat langer mee. Maar je laders moeten er wel bij passen. Zeven korte vragen, daarna
          eerst wat je moet oplossen.
        </p>
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
          {ITEMS.map((i, n) => (
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
              Bekijk de actielijst
            </button>
            <span className="muted small" aria-live="polite">
              {complete ? 'Alle vragen beantwoord.' : `${answered} van ${ITEMS.length} beantwoord`}
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
                    <span className="traffic-label">{LIGHT_LABEL[opt.light]}</span>
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
                  <h2>Al in orde</h2>
                </summary>
                <ul className="traffic">
                  {rows
                    .filter((r) => r.opt?.light === 'ok')
                    .map(({ item, opt }) =>
                      opt ? (
                        <li key={item.id} className="traffic-row light-ok">
                          <span className="traffic-label">{LIGHT_LABEL.ok}</span>
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
              <h3>Welke maat accu en laders?</h3>
              <p>De configurator houdt rekening met je huidige accu, EBL en dynamo, en geeft een stuklijst.</p>
              <Link href="/configurator" className="btn btn-primary">
                Bereken je systeem
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
