import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { BatteryDays, DeviceBars, EnergyChart, SystemDiagram } from '../components/charts'
import { CheckItem, ChoiceCards, Eyebrow, NumberStepper, Segmented } from '../components/ui'
import {
  DEVICES,
  DRIVING_OPTIONS,
  HOOKUP_OPTIONS,
  PROFILES,
  defaultDevices,
  type DeviceDef,
} from '../data/devices'
import { calculate, INVERTER_EFFICIENCY, LIFEPO4_DOD, MAX_DROP, type ComponentKind, type Result } from '../lib/calc'
import { clearStored, decodeShare, encodeShare, initialState, loadStored, store, type ConfigState } from '../lib/configState'
import { euro, fmt, fmt1, kwh } from '../lib/format'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'
import { MONTHS_LONG, MONTHS_SHORT, NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'

const STEPS = ['Reizen', 'Verbruik', 'Laden', 'Installatie', 'Jouw systeem'] as const

export function ConfiguratorPage() {
  usePageMeta(
    'Systeemconfigurator',
    'Bereken in vier stappen welke accu, zonnepanelen, laders en kabels je camper nodig heeft. Met maandbalans, stuklijst en veiligheidschecks.',
  )
  const { search, navigate } = useRouter()
  const shared = useMemo(() => {
    const code = new URLSearchParams(search).get('s')
    return code ? decodeShare(code) : null
  }, [search])

  const [state, setState] = useState<ConfigState>(() => shared ?? loadStored() ?? initialState())
  const [step, setStep] = useState(() => (shared ? 4 : 0))
  const [visited, setVisited] = useState(() => (shared ? 4 : 0))
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const result = useMemo(() => calculate(state), [state])

  useEffect(() => store(state), [state])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    document.getElementById('configurator')?.scrollIntoView({ block: 'start' })
  }, [step])

  const update = (patch: Partial<ConfigState>) => setState((s) => ({ ...s, ...patch }))
  const go = (n: number) => {
    setStep(n)
    setVisited((v) => Math.max(v, n))
    if (search) navigate('/configurator', { replace: true })
  }

  return (
    <div className="configurator" id="configurator">
      <div className="wrap">
        <nav aria-label="Stappen" className="progress">
          <ol>
            {STEPS.map((s, i) => (
              <li key={s} className={i === step ? 'is-current' : i < step ? 'is-done' : ''}>
                <button type="button" onClick={() => go(i)} disabled={i > visited} aria-current={i === step ? 'step' : undefined}>
                  <span className="progress-num">{i < step ? '✓' : i + 1}</span>
                  <span className="progress-label">{s}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {step < 4 ? (
          <div className="wizard">
            <section className="wizard-main" aria-labelledby="step-title">
              <Eyebrow>
                Stap {step + 1} van 4
              </Eyebrow>
              <h1 id="step-title" ref={headingRef} tabIndex={-1} className="step-title">
                {
                  [
                    'Hoe en wanneer reis je?',
                    'Wat wil je gebruiken?',
                    'Hoe laad je onderweg?',
                    'Wat zit er nu in je camper?',
                  ][step]
                }
              </h1>
              {step === 0 && <StepTravel state={state} update={update} />}
              {step === 1 && <StepDevices state={state} update={update} result={result} />}
              {step === 2 && <StepCharging state={state} update={update} />}
              {step === 3 && <StepCurrent state={state} update={update} />}
              <div className="wizard-nav">
                {step > 0 ? (
                  <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
                    ← Vorige
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>
                  {step === 3 ? 'Toon mijn systeem' : 'Volgende'} →
                </button>
              </div>
            </section>
            <LiveSummary result={result} onFinish={() => go(4)} />
          </div>
        ) : (
          <ResultView
            state={state}
            result={result}
            headingRef={headingRef}
            onEdit={go}
            onReset={() => {
              clearStored()
              setState(initialState())
              setVisited(0)
              go(0)
            }}
          />
        )}
      </div>
    </div>
  )
}

interface StepProps {
  state: ConfigState
  update: (patch: Partial<ConfigState>) => void
}

/* ---------- Step 1: travel ---------- */

function StepTravel({ state, update }: StepProps) {
  const maxH = Math.max(...NL_IRRADIATION)
  const toggleMonth = (m: number) => {
    const has = state.months.includes(m)
    if (has && state.months.length === 1) return
    update({ months: has ? state.months.filter((x) => x !== m) : [...state.months, m].sort((a, b) => a - b) })
  }
  return (
    <>
      <p className="lead">Kies een profiel dat in de buurt komt. Daarna stel je alles bij.</p>
      <fieldset className="field">
        <legend className="field-label">Welk profiel past het best?</legend>
        <div className="choice-grid cols-2">
          {PROFILES.map((p) => (
            <label key={p.id} className="choice">
              <input
                type="radio"
                name="profile"
                checked={state.profile === p.id}
                onChange={() =>
                  update({
                    profile: p.id,
                    devices: defaultDevices(p.devices),
                    months: [...p.months],
                    reserveDays: p.reserveDays,
                    driving: p.driving,
                    hookup: p.hookup,
                  })
                }
              />
              <span className="choice-body">
                <span className="choice-title">{p.name}</span>
                <span className="choice-detail">{p.summary}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field-label">In welke maanden reis je?</legend>
        <p className="field-hint">
          De balkjes tonen hoeveel zon er in Nederland valt. We rekenen met je donkerste reismaand.
        </p>
        <div className="months">
          {MONTHS_SHORT.map((m, i) => (
            <label key={m} className="month-chip">
              <input type="checkbox" checked={state.months.includes(i)} onChange={() => toggleMonth(i)} />
              <span className="month-sun" aria-hidden="true">
                <span style={{ height: `${(NL_IRRADIATION[i] / maxH) * 100}%` }} />
              </span>
              <span className="month-name">
                <span aria-hidden="true">{m}</span>
                <span className="sr-only">{MONTHS_LONG[i]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Segmented
        legend="Hoeveel dagen wil je kunnen overbruggen zonder te laden?"
        hint="Denk aan een paar grijze dagen op één plek. Meer dagen betekent een grotere accu."
        options={[1, 2, 3, 4, 5].map((d) => ({ value: d, label: `${d} ${d === 1 ? 'dag' : 'dagen'}` }))}
        value={state.reserveDays}
        onChange={(v) => update({ reserveDays: v, profile: 'custom' })}
      />
    </>
  )
}

/* ---------- Step 2: devices ---------- */

const GROUPS: { id: DeviceDef['group']; title: string }[] = [
  { id: 'basis', title: 'Basis' },
  { id: 'comfort', title: 'Comfort' },
  { id: 'zwaar', title: 'Zware 230V-apparaten' },
]

function StepDevices({ state, update, result }: StepProps & { result: Result }) {
  const setDevice = (id: string, patch: Partial<ConfigState['devices'][string]>) =>
    update({ devices: { ...state.devices, [id]: { ...state.devices[id], ...patch } }, profile: 'custom' })
  return (
    <>
      <p className="lead">
        Vink aan wat je gebruikt en pas vermogen en uren aan. Weet je het niet precies? De standaardwaarden zijn realistische
        gemiddelden.
      </p>
      {GROUPS.map((g) => (
        <fieldset key={g.id} className="field device-group">
          <legend className="field-label">{g.title}</legend>
          <ul className="devices">
            {DEVICES.filter((d) => d.group === g.id).map((d) => {
              const u = state.devices[d.id]
              const wh = u.watts * u.hours
              return (
                <li key={d.id} className={u.on ? 'device is-on' : 'device'}>
                  <label className="device-toggle">
                    <input type="checkbox" checked={u.on} onChange={(e) => setDevice(d.id, { on: e.target.checked })} />
                    <span className="device-name">
                      {d.name}
                      <span className={`tag tag-${d.supply}`}>{d.supply === 'dc' ? '12 V' : '230 V'}</span>
                    </span>
                    <span className="device-hint">{d.hint}</span>
                  </label>
                  {u.on && (
                    <div className="device-inputs">
                      <NumberStepper
                        compact
                        label={`${d.name}: vermogen`}
                        value={u.watts}
                        min={1}
                        max={3000}
                        step={d.watts >= 500 ? 100 : 5}
                        unit="W"
                        onChange={(v) => setDevice(d.id, { watts: v })}
                      />
                      <span className="times" aria-hidden="true">×</span>
                      <NumberStepper
                        compact
                        label={`${d.name}: uren per dag`}
                        value={u.hours}
                        min={0}
                        max={24}
                        step={d.hours < 1 ? 0.05 : 0.5}
                        unit="u"
                        onChange={(v) => setDevice(d.id, { hours: v })}
                      />
                      <span className="device-wh num">{fmt(wh)} Wh</span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </fieldset>
      ))}
      <p className="total-line">
        Totaal per dag <strong className="num">{fmt(result.dailyWh)} Wh</strong>
      </p>
      {result.acWh > 0 && (
        <p className="muted small">
          Inclusief {fmt(result.acWh - result.acWh * INVERTER_EFFICIENCY)} Wh verlies in de omvormer voor je 230V-apparaten.
        </p>
      )}
    </>
  )
}

/* ---------- Step 3: charging ---------- */

function StepCharging({ state, update }: StepProps) {
  return (
    <>
      <p className="lead">Zon is niet je enige bron. Rijden en walstroom maken je systeem kleiner en goedkoper.</p>
      <ChoiceCards
        legend="Hoe vaak rijd je?"
        hint="Tijdens het rijden laadt een DC-DC-lader je accu vanuit de dynamo."
        options={(Object.keys(DRIVING_OPTIONS) as (keyof typeof DRIVING_OPTIONS)[]).map((k) => ({
          value: k,
          label: DRIVING_OPTIONS[k].label,
          detail: DRIVING_OPTIONS[k].detail,
        }))}
        value={state.driving}
        onChange={(v) => update({ driving: v, profile: 'custom' })}
      />
      <ChoiceCards
        legend="Hoe vaak sta je op walstroom?"
        options={(Object.keys(HOOKUP_OPTIONS) as (keyof typeof HOOKUP_OPTIONS)[]).map((k) => ({
          value: k,
          label: HOOKUP_OPTIONS[k].label,
          detail: HOOKUP_OPTIONS[k].detail,
        }))}
        value={state.hookup}
        onChange={(v) => update({ hookup: v, profile: 'custom' })}
      />
      <Segmented
        legend="Hoeveel zonnepaneel past er op je dak?"
        hint="Een paneel van 100 Wp is ongeveer 1 × 0,55 m. Op een buscamper past vaak 200–300 Wp, op een halfintegraal 400–600 Wp. Houd ruimte vrij voor dakluiken en de airco."
        options={[200, 300, 400, 600, 800].map((v) => ({ value: v, label: `${v} Wp` }))}
        value={state.roofWp}
        onChange={(v) => update({ roofWp: v })}
      />
    </>
  )
}

/* ---------- Step 4: current install ---------- */

function StepCurrent({ state, update }: StepProps) {
  const tri = [
    { value: 'yes' as const, label: 'Ja' },
    { value: 'no' as const, label: 'Nee' },
    { value: 'unknown' as const, label: 'Weet ik niet' },
  ]
  return (
    <>
      <p className="lead">Zo zien we wat je kunt houden en waar je op moet letten bij de overstap.</p>
      <ChoiceCards
        legend="Welke accu zit er nu in?"
        options={[
          { value: 'agm', label: 'AGM, gel of natte accu', detail: 'De meeste campers van vóór 2020' },
          { value: 'lifepo4', label: 'Lithium (LiFePO4)', detail: 'Al overgestapt' },
          { value: 'none', label: 'Geen of weet ik niet', detail: 'Zelfbouw of nieuw' },
        ]}
        value={state.existingBattery}
        onChange={(v) => update({ existingBattery: v })}
      />
      {state.existingBattery !== 'none' && (
        <NumberStepper
          label="Capaciteit van je huidige accu"
          value={state.existingAh}
          min={20}
          max={1000}
          step={5}
          unit="Ah"
          onChange={(v) => update({ existingAh: v })}
        />
      )}
      <Segmented
        legend="Heeft je camper een elektroblok (EBL)?"
        hint="Een centraal kastje van bijvoorbeeld Schaudt, Nordelettronica of CBE dat lader en zekeringen combineert."
        options={tri}
        value={state.ebl}
        onChange={(v) => update({ ebl: v })}
      />
      <Segmented
        legend="Is je camper Euro 6 (meestal bouwjaar 2015 of later)?"
        hint="Die hebben vaak een slimme dynamo. Dat bepaalt welke DC-DC-lader je nodig hebt."
        options={tri}
        value={state.euro6}
        onChange={(v) => update({ euro6: v })}
      />
      <NumberStepper
        label="Kabellengte van startaccu naar woonaccu (enkele lengte)"
        value={state.starterCableM}
        min={0.5}
        max={15}
        step={0.5}
        unit="m"
        onChange={(v) => update({ starterCableM: v })}
      />
    </>
  )
}

/* ---------- Live summary ---------- */

function LiveSummary({ result, onFinish }: { result: Result; onFinish: () => void }) {
  return (
    <aside className="summary" aria-label="Tussenstand">
      <p className="summary-title">Tussenstand</p>
      <div className="summary-hero">
        <span className="summary-label">Verbruik per dag</span>
        <span className="summary-big num" aria-live="polite">
          {kwh(result.dailyWh)}
        </span>
      </div>
      <dl className="summary-list">
        <div>
          <dt>Accu</dt>
          <dd className="num">{fmt(result.battery.ah)} Ah</dd>
        </div>
        <div>
          <dt>Zonnepanelen</dt>
          <dd className="num">
            {fmt(result.solar.wp)} Wp{result.solar.capped && <span className="flag"> dak vol</span>}
          </dd>
        </div>
        <div>
          <dt>Zonder laden</dt>
          <dd className="num">{fmt1(result.battery.daysWithoutCharging)} dagen</dd>
        </div>
        <div>
          <dt>Budget, indicatie</dt>
          <dd className="num">
            {euro(result.budget.low)}–{euro(result.budget.high)}
          </dd>
        </div>
      </dl>
      <button type="button" className="btn btn-secondary btn-block" onClick={onFinish}>
        Direct naar resultaat
      </button>
    </aside>
  )
}

/* ---------- Result ---------- */

const BUY_TIPS: Record<ComponentKind, string> = {
  battery: 'Kies een accu met Bluetooth-BMS en beveiliging tegen laden onder 0 °C. Merk en garantietermijn tellen meer dan de laagste prijs.',
  solar: 'Starre panelen op een frame houden het langer vol en blijven koeler dan flexibele panelen die op het dak gelijmd zijn.',
  mppt: 'Controleer of de open-klemspanning (Voc) van je panelen bij kou onder de maximale ingangsspanning blijft, zeker bij panelen in serie.',
  dcdc: 'Kies een lader die op het motorsignaal (D+ of ignition) schakelt. Dat is nodig bij een slimme dynamo.',
  charger: 'Moet een instelbaar LiFePO4-profiel hebben: laden tot 14,2–14,4\u00a0V, geen egaliseerfase.',
  inverter: 'Zuivere sinus. Met walstroom is een model met ingebouwde voorrangsschakeling handig.',
  monitor: 'De shunt komt in de min-kabel, direct na de accu. Alles wat stroom gebruikt of levert, loopt erdoor.',
  wiring: 'Vertind, fijndradig koper. Geperste kabelschoenen, geen geklemde. Hoofdzekering binnen 20 cm van de pluspool.',
}

function ResultView({
  state,
  result: r,
  headingRef,
  onEdit,
  onReset,
}: {
  state: ConfigState
  result: Result
  headingRef: RefObject<HTMLHeadingElement | null>
  onEdit: (step: number) => void
  onReset: () => void
}) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const shareUrl = `${window.location.origin}/configurator?s=${encodeShare(state)}`

  const travel = state.months
  const shortMonths = travel.filter((m) => {
    const b = r.monthly[m]
    return b.solar + b.drive + b.hookup < b.use
  })
  const worst = Math.max(0, ...travel.map((m) => r.monthly[m].use - (r.monthly[m].solar + r.monthly[m].drive + r.monthly[m].hookup)))

  const share = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
  }

  return (
    <div className="result">
      <header className="result-head">
        <Eyebrow>Jouw systeem</Eyebrow>
        <h1 ref={headingRef} tabIndex={-1}>
          {fmt(r.battery.ah)} Ah lithium en {fmt(r.solar.wp)} Wp zon
        </h1>
        <p className="lead">
          Je verbruikt ongeveer <strong>{kwh(r.dailyWh)}</strong> per dag. Met een volle accu kom je{' '}
          <strong>{fmt1(r.battery.daysWithoutCharging)} dagen</strong> zonder laden.{' '}
          {shortMonths.length === 0
            ? 'In al je reismaanden vullen zon en rijden je accu weer aan.'
            : `In ${listMonths(shortMonths)} kom je tot ${fmt(worst)} Wh per dag tekort. Dan helpt een extra stuk rijden of een nacht op de camping.`}
        </p>
        <dl className="kpis">
          <div>
            <dt>Verbruik per dag</dt>
            <dd className="num">{kwh(r.dailyWh)}</dd>
          </div>
          <div>
            <dt>Accu, LiFePO4</dt>
            <dd className="num">{fmt(r.battery.ah)} Ah</dd>
          </div>
          <div>
            <dt>Zonnepanelen</dt>
            <dd className="num">{fmt(r.solar.wp)} Wp</dd>
          </div>
          <div>
            <dt>Materiaal, indicatie</dt>
            <dd className="num">
              {euro(r.budget.low)}–{euro(r.budget.high)}
            </dd>
          </div>
        </dl>
        <p className="source-line">
          Bron: PVGIS, De Bilt, en de aannames op de <Link href="/methode">methodepagina</Link>. Prijzen zijn een indicatie.
        </p>
        <div className="result-actions no-print">
          <button type="button" className="btn btn-secondary btn-sm" onClick={share}>
            Kopieer deellink
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            Print of bewaar als pdf
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(1)}>
            Verbruik aanpassen
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
            Opnieuw beginnen
          </button>
          <span className="share-status" role="status">
            {copied === 'ok' && 'Link gekopieerd.'}
            {copied === 'fail' && 'Kopiëren lukte niet. Kopieer de adresbalk na het openen van de link.'}
          </span>
        </div>
      </header>

      <section className="result-section" aria-labelledby="h-diagram">
        <div className="section-head">
          <h2 id="h-diagram">Zo hangt het samen</h2>
          <p>Drie bronnen laden één accu. Elke bron heeft een eigen lader die past bij die accu.</p>
        </div>
        <div className="panel">
          <SystemDiagram result={r} />
        </div>
      </section>

      <section className="result-section" aria-labelledby="h-balance">
        <div className="section-head">
          <h2 id="h-balance">Komt je energie rond?</h2>
          <p>
            Gemiddelde opbrengst per dag tegenover je verbruik. We ontwerpen op {MONTHS_LONG[r.solar.designMonth]}, je
            donkerste reismaand.
          </p>
        </div>
        <div className="panel">
          <EnergyChart monthly={r.monthly} travel={travel} designMonth={r.solar.designMonth} />
        </div>
      </section>

      <div className="result-split">
        <section className="result-section" aria-labelledby="h-devices">
          <div className="section-head">
            <h2 id="h-devices">Waar gaat je stroom heen?</h2>
          </div>
          <div className="panel">
            <DeviceBars lines={r.lines} total={r.dailyWh} />
            <button type="button" className="text-link no-print" onClick={() => onEdit(1)}>
              Apparaten aanpassen →
            </button>
          </div>
        </section>
        <section className="result-section" aria-labelledby="h-days">
          <div className="section-head">
            <h2 id="h-days">Hoe lang zonder laden?</h2>
          </div>
          <div className="panel">
            <BatteryDays usableWh={r.battery.usableWh} dailyWh={r.dailyWh} />
            <p className="muted small">
              {fmt(r.battery.ah)} Ah × 12,8 V × {fmt(LIFEPO4_DOD * 100)}% bruikbaar = {kwh(r.battery.usableWh)}.
            </p>
          </div>
        </section>
      </div>

      <section className="result-section" aria-labelledby="h-bom">
        <div className="section-head">
          <h2 id="h-bom">Je boodschappenlijst</h2>
          <p>Wat je nodig hebt, waarom, en waar je op let. De prijzen zijn grove marktindicaties voor materiaal, zonder montage.</p>
        </div>
        <ol className="bom">
          {r.components.map((c) => (
            <li key={c.kind} className={c.keep ? 'bom-item is-keep' : 'bom-item'}>
              <div className="bom-main">
                <h3>{c.title}</h3>
                <p className="bom-spec num">{c.spec}</p>
                <p className="bom-why">{c.why}</p>
              </div>
              <p className="bom-tip">
                <span className="bom-tip-label">Let bij kopen op</span>
                {BUY_TIPS[c.kind]}
              </p>
              <p className="bom-price num">{c.keep ? 'Houden' : `${euro(c.priceLow)}–${euro(c.priceHigh)}`}</p>
            </li>
          ))}
        </ol>
        <p className="bom-total">
          Totaal materiaal, indicatie
          <strong className="num">
            {euro(r.budget.low)}–{euro(r.budget.high)}
          </strong>
        </p>
        <p className="muted small">
          We linken nog niet naar winkels. Als we dat gaan doen, staat er altijd bij dat het een affiliatelink is.{' '}
          <Link href="/zo-verdienen-wij-geld">Zo verdienen wij geld</Link>.
        </p>
      </section>

      <section className="result-section" aria-labelledby="h-cables">
        <div className="section-head">
          <h2 id="h-cables">Kabels en zekeringen</h2>
          <p>
            Doorsnede op maximaal {fmt(MAX_DROP * 100)}% spanningsval en voldoende stroomcapaciteit. Lengte is enkele afstand;
            de min-kabel even dik.
          </p>
        </div>
        <div className="table-scroll panel">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Traject</th>
                <th scope="col">Stroom</th>
                <th scope="col">Lengte</th>
                <th scope="col">Kabel</th>
                <th scope="col">Zekering</th>
                <th scope="col">Spanningsval</th>
              </tr>
            </thead>
            <tbody>
              {r.cables.map((c) => (
                <tr key={c.id}>
                  <th scope="row">{c.label}</th>
                  <td className="num">{fmt(c.amps)} A</td>
                  <td className="num">{fmt1(c.lengthM)} m</td>
                  <td className="num">
                    <strong>{fmt1(c.mm2)} mm²</strong>
                  </td>
                  <td className="num">{fmt1(c.fuseA)} A</td>
                  <td className="num">{fmt1(c.dropPct)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          Meer uitleg in de gids <Link href="/gidsen/kabels-en-zekeringen">kabels en zekeringen</Link>.
        </p>
      </section>

      <section className="result-section" aria-labelledby="h-checks">
        <div className="section-head">
          <h2 id="h-checks">Controleer dit voor je koopt</h2>
        </div>
        <div className="checks">
          {r.checks.map((c) => (
            <CheckItem key={c.title} check={c} />
          ))}
        </div>
      </section>

      <section className="result-section" aria-labelledby="h-assumptions">
        <details className="assumptions">
          <summary>
            <h2 id="h-assumptions">Met deze aannames rekenden we</h2>
          </summary>
          <ul>
            <li>Accuspanning 12,8 V, LiFePO4 tot {fmt(LIFEPO4_DOD * 100)}% ontladen.</li>
            <li>Omvormer {fmt(INVERTER_EFFICIENCY * 100)}% rendement. 230V-verbruik telt daardoor zwaarder.</li>
            <li>
              Zon: gemiddelde instraling in {MONTHS_LONG[r.solar.designMonth]} in De Bilt (
              {fmt1(NL_IRRADIATION[r.solar.designMonth])} kWh/m² per dag, PVGIS), panelen plat op het dak,{' '}
              {fmt(PERFORMANCE_RATIO * 100)}% systeemrendement.
            </li>
            <li>
              Rijden: {fmt1(DRIVING_OPTIONS[state.driving].hoursPerDay)} uur per dag met een {r.dcdcA} A DC-DC-lader levert
              ongeveer {fmt(r.driveWhPerDay)} Wh.
            </li>
            <li>Walstroom: {fmt(r.hookupShare * 100)}% van je verbruik, gemiddeld over je reis.</li>
            <li>Kabels: koper, ρ = 0,0175 Ω·mm²/m. Zekering 1,25 × de maximale stroom.</li>
            <li>Reis je zuidelijker dan Nederland? Dan levert zon meer op en valt je systeem iets ruimer uit.</li>
          </ul>
          <Link href="/methode" className="text-link">
            Lees de volledige methode →
          </Link>
        </details>
      </section>

      <section className="next-steps no-print" aria-labelledby="h-next">
        <h2 id="h-next">Verder lezen</h2>
        <div className="card-grid cols-3">
          <Link href="/gidsen/dc-dc-lader" className="card card-link">
            <span className="card-title">DC-DC-lader kiezen</span>
            <span className="card-text">Waarom je lithium niet direct aan de dynamo hangt.</span>
          </Link>
          <Link href="/lithium-check" className="card card-link">
            <span className="card-title">Lithium-check</span>
            <span className="card-text">Kan je huidige EBL en lader met lithium overweg?</span>
          </Link>
          <Link href="/gidsen/veilig-installeren" className="card card-link">
            <span className="card-title">Veilig installeren</span>
            <span className="card-text">Zekeringen, kabelschoenen en wanneer je een vakman inschakelt.</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

function listMonths(ms: number[]) {
  const names = ms.map((m) => MONTHS_LONG[m])
  return names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} en ${names[names.length - 1]}`
}
