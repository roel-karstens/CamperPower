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
import { affiliateLinksFor } from '../data/markets'
import { deviceText, drivingText, groupTitle, hookupText, profileText } from '../i18n/catalog'
import { configCopy } from '../i18n/configCopy'
import { joinList } from '../i18n/locale'
import { monthNames } from '../i18n/months'
import { calculate, INVERTER_EFFICIENCY, LIFEPO4_DOD, MAX_DROP, type Result } from '../lib/calc'
import { clearStored, decodeShare, encodeShare, initialState, loadStored, store, type ConfigState } from '../lib/configState'
import { useFormat } from '../lib/format'
import { usePageMeta } from '../lib/meta'
import { Link, } from '../lib/router'
import { useRouter } from '../lib/useRouter'
import { NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'

export function ConfiguratorPage() {
  const { search, navigate, locale } = useRouter()
  const t = configCopy(locale)
  usePageMeta(t.metaTitle, t.meta)
  const shared = useMemo(() => {
    const code = new URLSearchParams(search).get('s')
    return code ? decodeShare(code) : null
  }, [search])

  const [state, setState] = useState<ConfigState>(() => shared ?? loadStored() ?? initialState())
  const [step, setStep] = useState(() => (shared ? 4 : 0))
  const [visited, setVisited] = useState(() => (shared ? 4 : 0))
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const result = useMemo(() => calculate(state, locale), [state, locale])

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
        <nav aria-label={t.stepsNav} className="progress">
          <ol>
            {t.steps.map((s, i) => (
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
              <Eyebrow>{t.stepOf(step + 1)}</Eyebrow>
              <h1 id="step-title" ref={headingRef} tabIndex={-1} className="step-title">
                {t.titles[step]}
              </h1>
              {step === 0 && <StepTravel state={state} update={update} />}
              {step === 1 && <StepDevices state={state} update={update} result={result} />}
              {step === 2 && <StepCharging state={state} update={update} />}
              {step === 3 && <StepCurrent state={state} update={update} />}
              <div className="wizard-nav">
                {step > 0 ? (
                  <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
                    {t.back}
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>
                  {step === 3 ? t.show : t.next} →
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
  const { locale } = useRouter()
  const t = configCopy(locale)
  const months = monthNames(locale)
  const maxH = Math.max(...NL_IRRADIATION)
  const toggleMonth = (m: number) => {
    const has = state.months.includes(m)
    if (has && state.months.length === 1) return
    update({ months: has ? state.months.filter((x) => x !== m) : [...state.months, m].sort((a, b) => a - b) })
  }
  return (
    <>
      <p className="lead">{t.travelLead}</p>
      <fieldset className="field">
        <legend className="field-label">{t.profileLegend}</legend>
        <div className="choice-grid cols-2">
          {PROFILES.map((p) => {
            const label = profileText(p.id, locale, p)
            return (
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
                <span className="choice-title">{label.name}</span>
                <span className="choice-detail">{label.summary}</span>
              </span>
            </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field-label">{t.monthsLegend}</legend>
        <p className="field-hint">{t.monthsHint}</p>
        <div className="months">
          {months.short.map((m, i) => (
            <label key={m} className="month-chip">
              <input type="checkbox" checked={state.months.includes(i)} onChange={() => toggleMonth(i)} />
              <span className="month-sun" aria-hidden="true">
                <span style={{ height: `${(NL_IRRADIATION[i] / maxH) * 100}%` }} />
              </span>
              <span className="month-name">
                <span aria-hidden="true">{m}</span>
                <span className="sr-only">{months.long[i]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Segmented
        legend={t.reserveLegend}
        hint={t.reserveHint}
        options={[1, 2, 3, 4, 5].map((d) => ({ value: d, label: `${d} ${t.day(d)}` }))}
        value={state.reserveDays}
        onChange={(v) => update({ reserveDays: v, profile: 'custom' })}
      />
    </>
  )
}

/* ---------- Step 2: devices ---------- */

const GROUPS: DeviceDef['group'][] = ['basis', 'comfort', 'zwaar']

function StepDevices({ state, update, result }: StepProps & { result: Result }) {
  const { locale } = useRouter()
  const t = configCopy(locale)
  const { fmt, hoursUnit } = useFormat()
  const setDevice = (id: string, patch: Partial<ConfigState['devices'][string]>) =>
    update({ devices: { ...state.devices, [id]: { ...state.devices[id], ...patch } }, profile: 'custom' })
  return (
    <>
      <p className="lead">{t.devicesLead}</p>
      {GROUPS.map((group) => (
        <fieldset key={group} className="field device-group">
          <legend className="field-label">{groupTitle(group, locale, t.groups[group])}</legend>
          <ul className="devices">
            {DEVICES.filter((d) => d.group === group).map((d) => {
              const u = state.devices[d.id]
              const label = deviceText(d.id, locale, d)
              const wh = u.watts * u.hours
              return (
                <li key={d.id} className={u.on ? 'device is-on' : 'device'}>
                  <label className="device-toggle">
                    <input type="checkbox" checked={u.on} onChange={(e) => setDevice(d.id, { on: e.target.checked })} />
                    <span className="device-name">
                      {label.name}
                      <span className={`tag tag-${d.supply}`}>{d.supply === 'dc' ? '12 V' : '230 V'}</span>
                    </span>
                    <span className="device-hint">{label.hint}</span>
                  </label>
                  {u.on && (
                    <div className="device-inputs">
                      <NumberStepper
                        compact
                        label={`${label.name}: ${t.watts}`}
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
                        label={`${label.name}: ${t.hours}`}
                        value={u.hours}
                        min={0}
                        max={24}
                        step={d.hours < 1 ? 0.05 : 0.5}
                        unit={hoursUnit}
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
        {t.total} <strong className="num">{fmt(result.dailyWh)} Wh</strong>
      </p>
      {result.acWh > 0 && (
        <p className="muted small">{t.inverterLoss(fmt(result.acWh - result.acWh * INVERTER_EFFICIENCY))}</p>
      )}
    </>
  )
}

/* ---------- Step 3: charging ---------- */

function StepCharging({ state, update }: StepProps) {
  const { locale } = useRouter()
  const t = configCopy(locale)
  return (
    <>
      <p className="lead">{t.chargeLead}</p>
      <ChoiceCards
        legend={t.driveLegend}
        hint={t.driveHint}
        options={(Object.keys(DRIVING_OPTIONS) as (keyof typeof DRIVING_OPTIONS)[]).map((k) => {
          const label = drivingText(k, locale, DRIVING_OPTIONS[k])
          return { value: k, label: label.label, detail: label.detail }
        })}
        value={state.driving}
        onChange={(v) => update({ driving: v, profile: 'custom' })}
      />
      <ChoiceCards
        legend={t.hookupLegend}
        options={(Object.keys(HOOKUP_OPTIONS) as (keyof typeof HOOKUP_OPTIONS)[]).map((k) => {
          const label = hookupText(k, locale, HOOKUP_OPTIONS[k])
          return { value: k, label: label.label, detail: label.detail }
        })}
        value={state.hookup}
        onChange={(v) => update({ hookup: v, profile: 'custom' })}
      />
      <Segmented
        legend={t.roofLegend}
        hint={t.roofHint}
        options={[200, 300, 400, 600, 800].map((v) => ({ value: v, label: `${v} Wp` }))}
        value={state.roofWp}
        onChange={(v) => update({ roofWp: v })}
      />
    </>
  )
}

/* ---------- Step 4: current install ---------- */

function StepCurrent({ state, update }: StepProps) {
  const { locale } = useRouter()
  const t = configCopy(locale)
  const tri = [
    { value: 'yes' as const, label: t.yes },
    { value: 'no' as const, label: t.no },
    { value: 'unknown' as const, label: t.unknown },
  ]
  return (
    <>
      <p className="lead">{t.currentLead}</p>
      <ChoiceCards
        legend={t.batteryLegend}
        options={t.batteries}
        value={state.existingBattery}
        onChange={(v) => update({ existingBattery: v })}
      />
      {state.existingBattery !== 'none' && (
        <NumberStepper
          label={t.capacity}
          value={state.existingAh}
          min={20}
          max={1000}
          step={5}
          unit="Ah"
          onChange={(v) => update({ existingAh: v })}
        />
      )}
      <Segmented
        legend={t.eblLegend}
        hint={t.eblHint}
        options={tri}
        value={state.ebl}
        onChange={(v) => update({ ebl: v })}
      />
      <Segmented
        legend={t.euroLegend}
        hint={t.euroHint}
        options={tri}
        value={state.euro6}
        onChange={(v) => update({ euro6: v })}
      />
      <NumberStepper
        label={t.cableLabel}
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
  const { locale } = useRouter()
  const t = configCopy(locale)
  const { fmt, fmt1, kwh, euro } = useFormat()
  return (
    <aside className="summary" aria-label={t.summaryLabel}>
      <p className="summary-title">{t.summaryLabel}</p>
      <div className="summary-hero">
        <span className="summary-label">{t.summaryUse}</span>
        <span className="summary-big num" aria-live="polite">
          {kwh(result.dailyWh)}
        </span>
      </div>
      <dl className="summary-list">
        <div>
          <dt>{t.summaryBattery}</dt>
          <dd className="num">{fmt(result.battery.ah)} Ah</dd>
        </div>
        <div>
          <dt>{t.summarySolar}</dt>
          <dd className="num">
            {fmt(result.solar.wp)} Wp{result.solar.capped && <span className="flag">{t.roofFull}</span>}
          </dd>
        </div>
        <div>
          <dt>{t.summaryDays}</dt>
          <dd className="num">{fmt1(result.battery.daysWithoutCharging)} {t.day(2)}</dd>
        </div>
        <div>
          <dt>{t.summaryBudget}</dt>
          <dd className="num">
            {euro(result.budget.low)}–{euro(result.budget.high)}
          </dd>
        </div>
      </dl>
      <button type="button" className="btn btn-secondary btn-block" onClick={onFinish}>
        {t.toResult}
      </button>
    </aside>
  )
}

/* ---------- Result ---------- */

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
  const { locale } = useRouter()
  const t = configCopy(locale)
  const { fmt, fmt1, kwh, euro } = useFormat()
  const months = monthNames(locale)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const shareUrl = `${window.location.origin}${locale === 'en' ? '/en' : ''}/configurator?s=${encodeShare(state)}`

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
        <Eyebrow>{t.resultEyebrow}</Eyebrow>
        <h1 ref={headingRef} tabIndex={-1}>
          {t.resultTitle(fmt(r.battery.ah), fmt(r.solar.wp))}
        </h1>
        <p className="lead">
          {t.resultLead(kwh(r.dailyWh), fmt1(r.battery.daysWithoutCharging))}
          {shortMonths.length === 0
            ? t.allMonthsOk
            : t.shortMonths(joinList(shortMonths.map((m) => months.long[m]), locale), fmt(worst))}
        </p>
        <dl className="kpis">
          <div>
            <dt>{t.kpiUse}</dt>
            <dd className="num">{kwh(r.dailyWh)}</dd>
          </div>
          <div>
            <dt>{t.kpiBattery}</dt>
            <dd className="num">{fmt(r.battery.ah)} Ah</dd>
          </div>
          <div>
            <dt>{t.kpiSolar}</dt>
            <dd className="num">{fmt(r.solar.wp)} Wp</dd>
          </div>
          <div>
            <dt>{t.kpiBudget}</dt>
            <dd className="num">
              {euro(r.budget.low)}–{euro(r.budget.high)}
            </dd>
          </div>
        </dl>
        <p className="source-line">
          {t.sourceLine} <Link href="/methode">{t.methodPage}</Link>. {t.pricesNote}
        </p>
        <div className="result-actions no-print">
          <button type="button" className="btn btn-secondary btn-sm" onClick={share}>
            {t.copy}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            {t.print}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(1)}>
            {t.editUse}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
            {t.reset}
          </button>
          <span className="share-status" role="status">
            {copied === 'ok' && t.copied}
            {copied === 'fail' && t.copyFail}
          </span>
        </div>
      </header>

      <section className="result-section" aria-labelledby="h-diagram">
        <div className="section-head">
          <h2 id="h-diagram">{t.diagramTitle}</h2>
          <p>{t.diagramBody}</p>
        </div>
        <div className="panel">
          <SystemDiagram result={r} />
        </div>
      </section>

      <section className="result-section" aria-labelledby="h-balance">
        <div className="section-head">
          <h2 id="h-balance">{t.balanceTitle}</h2>
          <p>{t.balanceBody(months.long[r.solar.designMonth])}</p>
        </div>
        <div className="panel">
          <EnergyChart monthly={r.monthly} travel={travel} designMonth={r.solar.designMonth} />
        </div>
      </section>

      <div className="result-split">
        <section className="result-section" aria-labelledby="h-devices">
          <div className="section-head">
            <h2 id="h-devices">{t.devicesTitle}</h2>
          </div>
          <div className="panel">
            <DeviceBars lines={r.lines} total={r.dailyWh} />
            <button type="button" className="text-link no-print" onClick={() => onEdit(1)}>
              {t.editDevices} →
            </button>
          </div>
        </section>
        <section className="result-section" aria-labelledby="h-days">
          <div className="section-head">
            <h2 id="h-days">{t.daysTitle}</h2>
          </div>
          <div className="panel">
            <BatteryDays usableWh={r.battery.usableWh} dailyWh={r.dailyWh} />
            <p className="muted small">
              {t.daysNote(fmt(r.battery.ah), fmt(LIFEPO4_DOD * 100), kwh(r.battery.usableWh))}
            </p>
          </div>
        </section>
      </div>

      <section className="result-section" aria-labelledby="h-bom">
        <div className="section-head">
          <h2 id="h-bom">{t.bomTitle}</h2>
          <p>{t.bomBody}</p>
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
                <span className="bom-tip-label">{t.buyLabel}</span>
                {t.tips[c.kind]}
              </p>
              <p className="bom-price num">
                {c.keep ? t.keep : `${euro(c.priceLow)}–${euro(c.priceHigh)}`}
                {affiliateLinksFor(locale, c.kind).map((offer) => (
                  <a key={offer.id} href={offer.url} className="text-link" target="_blank" rel="sponsored noopener noreferrer">
                    {t.shopLink(offer.merchant)}
                  </a>
                ))}
              </p>
            </li>
          ))}
        </ol>
        <p className="bom-total">
          {t.bomTotal}
          <strong className="num">
            {euro(r.budget.low)}–{euro(r.budget.high)}
          </strong>
        </p>
        <p className="muted small">
          {t.noShops} <Link href="/zo-verdienen-wij-geld">{t.money}</Link>.
        </p>
      </section>

      <section className="result-section" aria-labelledby="h-cables">
        <div className="section-head">
          <h2 id="h-cables">{t.cablesTitle}</h2>
          <p>{t.cablesBody(fmt(MAX_DROP * 100))}</p>
        </div>
        <div className="table-scroll panel">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{t.colRun}</th>
                <th scope="col">{t.colCurrent}</th>
                <th scope="col">{t.colLength}</th>
                <th scope="col">{t.colCable}</th>
                <th scope="col">{t.colFuse}</th>
                <th scope="col">{t.colDrop}</th>
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
          {t.cableGuide} <Link href="/gidsen/kabels-en-zekeringen">{t.cableGuideLabel}</Link>.
        </p>
      </section>

      <section className="result-section" aria-labelledby="h-checks">
        <div className="section-head">
          <h2 id="h-checks">{t.checksTitle}</h2>
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
            <h2 id="h-assumptions">{t.assumptions}</h2>
          </summary>
          <ul>
            <li>{t.assumptionBattery(fmt(LIFEPO4_DOD * 100))}</li>
            <li>{t.assumptionInverter(fmt(INVERTER_EFFICIENCY * 100))}</li>
            <li>
              {t.assumptionSun(months.long[r.solar.designMonth], fmt1(NL_IRRADIATION[r.solar.designMonth]), fmt(PERFORMANCE_RATIO * 100))}
            </li>
            <li>{t.assumptionDrive(fmt1(DRIVING_OPTIONS[state.driving].hoursPerDay), r.dcdcA, fmt(r.driveWhPerDay))}</li>
            <li>{t.assumptionHookup(fmt(r.hookupShare * 100))}</li>
            <li>{t.assumptionCable}</li>
            <li>{t.assumptionSouth}</li>
          </ul>
          <Link href="/methode" className="text-link">
            {t.fullMethod} →
          </Link>
        </details>
      </section>

      <section className="next-steps no-print" aria-labelledby="h-next">
        <h2 id="h-next">{t.nextTitle}</h2>
        <div className="card-grid cols-3">
          {t.further.map((item) => (
            <Link key={item.href} href={item.href} className="card card-link">
              <span className="card-title">{item.title}</span>
              <span className="card-text">{item.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

