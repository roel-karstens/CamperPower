import { useRef, useState } from 'react'
import { ChoiceCards, Eyebrow } from '../components/ui'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'

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

function diagnose(a: Required<Answers>): Cause[] {
  const causes: Cause[] = []

  // 1. Battery worn out (lead) – typically "empty after one night".
  let aging = 0
  if (a.kind !== 'lithium') {
    if (a.age === 'old') aging += 3
    if (a.age === 'mid') aging += 1.5
    if (a.age === 'unknown') aging += 1
    if (a.when === 'night') aging += 2
  }
  causes.push({
    id: 'aging',
    title: 'De accu is versleten',
    score: aging,
    why: 'Een loodaccu (AGM, gel of nat) verliest elk jaar capaciteit, sneller als hij vaak diep ontladen is. Na 4 tot 6 jaar is er soms nog maar de helft over. Hij lijkt vol, maar is na één avond leeg.',
    fix: [
      'Laat de accu een nacht rusten na volledig laden en meet de spanning: onder 12,5 V is hij waarschijnlijk versleten.',
      'Laat een capaciteitstest doen bij een accuspecialist of camperbedrijf.',
      'Vervang je hem? Overweeg dan direct LiFePO4: 90% bruikbaar in plaats van 50%.',
    ],
    link: { href: '/lithium-check', label: 'Kan lithium in jouw camper?' },
  })

  // 2. Not charging while driving.
  let drive = 0
  if (a.when === 'driving') drive += 3
  if (a.drive === 'little') drive += 3
  if (a.drive === 'unknown') drive += 1
  if (a.year === 'post2015' && a.drive !== 'yes') drive += 2
  if (a.kind === 'lithium' && a.drive !== 'yes') drive += 1
  causes.push({
    id: 'drive',
    title: 'De accu laadt niet (goed) tijdens het rijden',
    score: drive,
    why: 'Bij campers vanaf ongeveer 2015 (Euro 6) verlaagt de motor de dynamospanning tijdens het rijden. Een gewoon scheidingsrelais laadt de woonaccu dan nauwelijks. Een te dunne of lange kabel maakt het erger.',
    fix: [
      'Meet de spanning op de woonaccu met draaiende motor. Onder 13,2 V laadt hij nauwelijks.',
      'Vervang het scheidingsrelais door een DC-DC-lader die op het motorsignaal (D+) schakelt.',
      'Controleer de zekering tussen startaccu en woonaccu. Die is vaak doorgebrand zonder dat iemand het merkt.',
    ],
    link: { href: '/gidsen/dc-dc-lader', label: 'Lees over de DC-DC-lader' },
  })

  // 3. Inverter idle draw.
  let idle = 0
  if (a.inverter === 'on') idle += 3
  if (a.inverter === 'on' && (a.when === 'night' || a.when === 'days')) idle += 1
  causes.push({
    id: 'idle',
    title: 'De omvormer verbruikt stroom terwijl hij niets doet',
    score: idle,
    why: 'Een omvormer die aan staat, verbruikt ook zonder apparaat 8 tot 30 W. Dat is 200 tot 700 Wh per dag: meer dan een koelkast.',
    fix: [
      'Zet de omvormer alleen aan als je hem gebruikt.',
      'Laad telefoons en laptop via 12V/USB in plaats van 230 V.',
      'Zoek bij vervanging een omvormer met spaar- of zoekstand.',
    ],
  })

  // 4. Consumption larger than what the battery + charging can supply.
  let capacity = 0
  if (a.when === 'days') capacity += 3
  if (a.when === 'night') capacity += 1
  if (a.solar === 'none') capacity += 2
  if (a.solar === 'small') capacity += 1
  if (a.kind === 'lead') capacity += 1
  causes.push({
    id: 'capacity',
    title: 'Je verbruikt meer dan je accu en laders bijhouden',
    score: capacity,
    why: 'Een koelkast, verwarming en laptop samen gebruiken al snel 800 Wh per dag. Een loodaccu van 95 Ah levert er bruikbaar maar ongeveer 600. Zonder genoeg zon of rijden loop je elke dag een beetje leeg.',
    fix: [
      'Bereken je dagverbruik per apparaat. Vaak is één apparaat de grote verbruiker.',
      'Een (groter) zonnepaneel of een grotere accu lost het structureel op.',
      'Bereken in de configurator wat je nodig hebt voor jouw reizen.',
    ],
    link: { href: '/configurator', label: 'Bereken je systeem' },
  })

  // 5. Parasitic drain during storage.
  let parasitic = 0
  if (a.when === 'storage') parasitic += 4
  causes.push({
    id: 'parasitic',
    title: 'Sluipverbruik tijdens stilstaan',
    score: parasitic,
    why: 'Ook als alles uit staat, verbruiken het bedieningspaneel, een gasmelder, de accumonitor, alarm of tracker stroom. Een paar honderd milliampère maakt een accu in enkele weken leeg. Een diep ontladen loodaccu raakt blijvend beschadigd.',
    fix: [
      'Zet in de stalling de hoofdschakelaar of accuschakelaar uit.',
      'Laat een klein zonnepaneel of een walstroomlader de accu bijhouden.',
      'Meet met een multimeter in serie hoeveel er loopt als alles uit staat.',
    ],
  })

  // 6. Lithium never fully charged.
  let lithium = 0
  if (a.kind === 'lithium') {
    lithium += 2
    if (a.when === 'night' || a.when === 'days') lithium += 1
  }
  causes.push({
    id: 'lithium',
    title: 'De lithiumaccu wordt nooit echt vol',
    score: lithium,
    why: 'Laders zonder lithiumprofiel stoppen te vroeg of druppelladen te lang. De accumonitor raakt dan ook ontregeld: hij zegt 60% terwijl het 30% is.',
    fix: [
      'Controleer of elke lader (walstroom, zon, DC-DC) op LiFePO4 staat: 14,2–14,4\u00a0V, geen druppellading.',
      'Laad één keer volledig tot het BMS de lading stopt, zodat de monitor opnieuw kalibreert.',
      'Kijk in de app van het BMS of alle cellen even ver geladen zijn.',
    ],
    link: { href: '/gidsen/lithium-op-oude-ebl', label: 'Lithium op een oude EBL' },
  })

  return causes.filter((c) => c.score > 0).sort((x, y) => y.score - x.score)
}

function likelihood(score: number, top: number, first: boolean): { label: string; cls: string } {
  const r = score / top
  if (r >= 0.75) return { label: first ? 'Meest waarschijnlijk' : 'Ook waarschijnlijk', cls: 'high' }
  if (r >= 0.4) return { label: 'Mogelijk', cls: 'mid' }
  return { label: 'Minder waarschijnlijk', cls: 'low' }
}

const QUESTIONS = 7

export function AccuLeegPage() {
  usePageMeta(
    'Accu steeds leeg? Vind de oorzaak',
    'Is de woonaccu van je camper steeds leeg? Beantwoord zeven vragen en zie de waarschijnlijke oorzaken, met wat je eraan kunt doen.',
  )
  const [a, setA] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const answered = Object.values(a).filter(Boolean).length
  const complete = answered === QUESTIONS
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((prev) => ({ ...prev, [k]: v }))
  const causes = complete ? diagnose(a as Required<Answers>) : []
  const top = causes[0]?.score ?? 1

  return (
    <div className="wrap page tool-page">
      <header className="page-head">
        <Eyebrow>Diagnose</Eyebrow>
        <h1>Accu steeds leeg?</h1>
        <p className="lead">
          Zeven vragen, geen meetapparatuur nodig. Je krijgt de waarschijnlijke oorzaken op volgorde, met wat je eraan kunt
          doen.
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
          <ChoiceCards<When>
            legend="1. Wanneer is de accu leeg?"
            columns={2}
            value={a.when as When}
            onChange={(v) => set('when', v)}
            options={[
              { value: 'night', label: 'Al na één nacht', detail: 'Terwijl hij vol leek' },
              { value: 'days', label: 'Na twee of drie dagen vrij staan', detail: 'Zonder walstroom' },
              { value: 'driving', label: 'Zelfs als ik veel rijd', detail: 'Rijden lijkt niet te helpen' },
              { value: 'storage', label: 'Na een tijd stilstaan', detail: 'In de stalling of thuis' },
            ]}
          />
          <ChoiceCards<Kind>
            legend="2. Wat voor woonaccu heb je?"
            value={a.kind as Kind}
            onChange={(v) => set('kind', v)}
            options={[
              { value: 'lead', label: 'AGM, gel of nat', detail: 'Loodaccu, zwaar' },
              { value: 'lithium', label: 'Lithium (LiFePO4)' },
              { value: 'unknown', label: 'Weet ik niet' },
            ]}
          />
          <ChoiceCards<Age>
            legend="3. Hoe oud is de accu?"
            columns={4}
            value={a.age as Age}
            onChange={(v) => set('age', v)}
            options={[
              { value: 'new', label: 'Tot 3 jaar' },
              { value: 'mid', label: '3 tot 6 jaar' },
              { value: 'old', label: 'Ouder dan 6 jaar' },
              { value: 'unknown', label: 'Weet ik niet' },
            ]}
          />
          <ChoiceCards<DriveCharge>
            legend="4. Wordt de accu voller als je een uur rijdt?"
            hint="Kijk op het bedieningspaneel of de accumonitor, voor en na het rijden."
            value={a.drive as DriveCharge}
            onChange={(v) => set('drive', v)}
            options={[
              { value: 'yes', label: 'Ja, duidelijk' },
              { value: 'little', label: 'Nauwelijks' },
              { value: 'unknown', label: 'Weet ik niet' },
            ]}
          />
          <ChoiceCards<Year>
            legend="5. Bouwjaar van de basisauto"
            hint="Staat op het kentekenbewijs. Vanaf 2015 meestal Euro 6 met slimme dynamo."
            value={a.year as Year}
            onChange={(v) => set('year', v)}
            options={[
              { value: 'pre2015', label: 'Vóór 2015' },
              { value: 'post2015', label: '2015 of later' },
              { value: 'unknown', label: 'Weet ik niet' },
            ]}
          />
          <ChoiceCards<Solar>
            legend="6. Zonnepaneel op het dak?"
            value={a.solar as Solar}
            onChange={(v) => set('solar', v)}
            options={[
              { value: 'none', label: 'Geen' },
              { value: 'small', label: 'Tot 150 Wp' },
              { value: 'large', label: 'Meer dan 150 Wp' },
            ]}
          />
          <ChoiceCards<Inverter>
            legend="7. Staat de omvormer (230V-stopcontact) vaak aan?"
            value={a.inverter as Inverter}
            onChange={(v) => set('inverter', v)}
            options={[
              { value: 'on', label: 'Ja, meestal' },
              { value: 'off', label: 'Alleen als ik hem gebruik' },
              { value: 'none', label: 'Geen omvormer' },
            ]}
          />
          <div className="tool-submit">
            <button type="submit" className="btn btn-primary btn-lg" disabled={!complete}>
              Bekijk de oorzaken
            </button>
            <span className="muted small" aria-live="polite">
              {complete ? 'Alle vragen beantwoord.' : `${answered} van ${QUESTIONS} beantwoord`}
            </span>
          </div>
        </form>

        {submitted && complete && (
          <section className="tool-result" aria-labelledby="diag-result">
            <h2 id="diag-result" ref={resultRef} tabIndex={-1}>
              Waarschijnlijke oorzaken
            </h2>
            <p className="muted">
              Op volgorde van waarschijnlijkheid, op basis van je antwoorden. Vaak spelen er twee tegelijk.
            </p>
            <ol className="causes">
              {causes.map((c, i) => {
                const l = likelihood(c.score, top, i === 0)
                return (
                  <li key={c.id} className={`cause cause-${l.cls}`}>
                    <div className="cause-head">
                      <h3>{c.title}</h3>
                      <span className={`pill pill-${l.cls}`}>{l.label}</span>
                    </div>
                    <div className="meter" aria-hidden="true">
                      <span style={{ width: `${Math.max(12, (c.score / top) * 100)}%` }} />
                    </div>
                    <p>{c.why}</p>
                    <h4>Wat je kunt doen</h4>
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
            <div className="next-box">
              <h3>Structureel oplossen?</h3>
              <p>Bereken welke accu, zonnepanelen en laders passen bij hoe jij reist.</p>
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
