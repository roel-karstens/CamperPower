import { useEffect, useId, useRef, useState } from 'react'
import { chrome } from '../i18n/chrome'
import { monthNames } from '../i18n/months'
import type { DeviceLine, MonthBalance, Result } from '../lib/calc'
import { useFormat } from '../lib/format'
import { useRouter } from '../lib/useRouter'

/* ---------- System diagram ---------- */

interface Box {
  x: number
  y: number
  w: number
  h: number
}

interface DiagramNode extends Box {
  id: string
  label: string
  value: string
  active: boolean
  kind: 'source' | 'device' | 'battery' | 'load'
}

type Layout = 'wide' | 'narrow'

function diagramNodes(
  r: Result,
  layout: Layout,
  labels: ReturnType<typeof chrome>['chart'],
  fmt: (n: number) => string,
  kwh: (wh: number) => string,
): { nodes: DiagramNode[]; width: number; height: number } {
  const hasAc = r.inverterW > 0
  const sources = [
    { id: 'sun', label: labels.sun, value: `${fmt(r.solar.wp)} Wp`, active: true },
    { id: 'alt', label: labels.alternator, value: labels.whileDriving, active: true },
    { id: 'shore', label: labels.shore, value: r.hookupShare > 0 ? labels.onCampsite : labels.notPlanned, active: r.hookupShare > 0 },
  ]
  const devices = [
    { id: 'mppt', label: labels.mppt, value: `${r.mpptA} A`, active: true },
    { id: 'dcdc', label: labels.dcdc, value: `${r.dcdcA} A`, active: true },
    { id: 'charger', label: labels.charger, value: `${r.chargerA} A`, active: r.hookupShare > 0 },
  ]
  const battery = { id: 'battery', label: labels.battery, value: `${fmt(r.battery.ah)} Ah`, active: true }
  const loads = [
    { id: 'dc', label: labels.dcLoads, value: kwh(r.dcWh) + labels.perDay, active: r.dcWh > 0 },
    ...(hasAc
      ? [{ id: 'ac', label: labels.inverter(fmt(r.inverterW)), value: labels.acValue(kwh(r.acWh)), active: true }]
      : []),
  ]

  const nodes: DiagramNode[] = []
  if (layout === 'wide') {
    const rowY = [20, 116, 212]
    sources.forEach((s, i) => nodes.push({ ...s, kind: 'source', x: 8, y: rowY[i], w: 136, h: 68 }))
    devices.forEach((s, i) => nodes.push({ ...s, kind: 'device', x: 196, y: rowY[i], w: 148, h: 68 }))
    nodes.push({ ...battery, kind: 'battery', x: 400, y: 98, w: 164, h: 104 })
    const loadY = loads.length === 1 ? [116] : [56, 176]
    loads.forEach((s, i) => nodes.push({ ...s, kind: 'load', x: 616, y: loadY[i], w: 176, h: 68 }))
    return { nodes, width: 800, height: 300 }
  }
  const colX = [6, 124, 242]
  sources.forEach((s, i) => nodes.push({ ...s, kind: 'source', x: colX[i], y: 8, w: 112, h: 64 }))
  devices.forEach((s, i) => nodes.push({ ...s, kind: 'device', x: colX[i], y: 120, w: 112, h: 64 }))
  nodes.push({ ...battery, kind: 'battery', x: 90, y: 236, w: 180, h: 92 })
  const loadX = loads.length === 1 ? [90] : [6, 186]
  loads.forEach((s, i) => nodes.push({ ...s, kind: 'load', x: loadX[i], y: 380, w: loads.length === 1 ? 180 : 168, h: 64 }))
  return { nodes, width: 360, height: 452 }
}

function link(a: Box, b: Box, layout: Layout, slot = 0, slots = 1): string {
  if (layout === 'wide') {
    const x1 = a.x + a.w
    const y1 = a.y + a.h / 2
    const x2 = b.x
    const y2 = b.y + (b.h * (slot + 1)) / (slots + 1)
    const mx = (x1 + x2) / 2
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
  }
  const x1 = a.x + a.w / 2
  const y1 = a.y + a.h
  const x2 = b.x + (b.w * (slot + 1)) / (slots + 1)
  const y2 = b.y
  const my = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`
}

function DiagramSvg({ r, layout }: { r: Result; layout: Layout }) {
  const titleId = useId()
  const { locale } = useRouter()
  const { fmt, kwh } = useFormat()
  const labels = chrome(locale).chart
  const { nodes, width, height } = diagramNodes(r, layout, labels, fmt, kwh)
  const by = (id: string) => nodes.find((n) => n.id === id) as DiagramNode
  const battery = by('battery')
  const pairs: [string, string][] = [
    ['sun', 'mppt'],
    ['alt', 'dcdc'],
    ['shore', 'charger'],
  ]
  const loads = nodes.filter((n) => n.kind === 'load')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`diagram diagram-${layout}`}
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>
        {labels.diagram(
          r.mpptA,
          r.dcdcA,
          r.chargerA,
          fmt(r.battery.ah),
          r.inverterW ? labels.inverterClause(fmt(r.inverterW)) : '',
        )}
      </title>
      <g fill="none" strokeWidth="2" strokeLinecap="round">
        {pairs.map(([s, d], i) => {
          const active = by(s).active
          return (
            <g key={s} className={active ? 'flow-on' : 'flow-off'}>
              <path d={link(by(s), by(d), layout)} className="wire" />
              <path d={link(by(d), battery, layout, i, 3)} className="wire" />
              {active && <path d={link(by(s), by(d), layout)} className="flow" />}
              {active && <path d={link(by(d), battery, layout, i, 3)} className="flow" />}
            </g>
          )
        })}
        {loads.map((l) => (
          <g key={l.id} className="flow-on flow-out">
            <path d={link(battery, l, layout)} className="wire" />
            <path d={link(battery, l, layout)} className="flow" />
          </g>
        ))}
      </g>
      {nodes.map((n) => (
        <g key={n.id} className={`node node-${n.kind} ${n.active ? '' : 'node-off'}`}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.kind === 'battery' ? 10 : 8} />
          {n.kind === 'battery' && (
            <>
              <rect x={n.x + n.w / 2 - 22} y={n.y - 7} width="14" height="7" rx="2" className="terminal" />
              <rect x={n.x + n.w / 2 + 8} y={n.y - 7} width="14" height="7" rx="2" className="terminal" />
            </>
          )}
          <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 7} textAnchor="middle" className="node-label">
            {n.label}
          </text>
          <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 15} textAnchor="middle" className="node-value">
            {n.value}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function SystemDiagram({ result }: { result: Result }) {
  return (
    <div className="diagram-wrap">
      <DiagramSvg r={result} layout="wide" />
      <DiagramSvg r={result} layout="narrow" />
    </div>
  )
}

/* ---------- Monthly energy balance ---------- */

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

export function EnergyChart({
  monthly,
  travel,
  designMonth,
}: {
  monthly: MonthBalance[]
  travel: readonly number[]
  designMonth: number
}) {
  const titleId = useId()
  const { locale } = useRouter()
  const { fmt } = useFormat()
  const labels = chrome(locale).chart
  const months = monthNames(locale)
  const [ref, measured] = useWidth<HTMLElement>(720)
  const W = Math.max(280, measured)
  const compact = W < 520
  const H = compact ? 240 : 300
  const left = compact ? 44 : 52
  const right = 12
  const top = 20
  const bottom = 34
  const plotW = W - left - right
  const plotH = H - top - bottom
  const use = monthly[0]?.use ?? 0
  const max = Math.max(use, ...monthly.map((m) => m.solar + m.drive + m.hookup)) * 1.08 || 1
  const y = (v: number) => top + plotH - (v / max) * plotH
  const slot = plotW / 12
  const bw = slot * 0.62
  const ticks = niceTicks(max)

  return (
    <figure className="chart" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={titleId}>
        <title id={titleId}>{labels.balanceTitle(fmt(use))}</title>
        {ticks.map((t) => (
          <g key={t} className="grid">
            <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} />
            <text x={left - 8} y={y(t) + 4} textAnchor="end">
              {fmt(t)}
            </text>
          </g>
        ))}
        {monthly.map((m, i) => {
          const x = left + i * slot + (slot - bw) / 2
          const inTrip = travel.includes(i)
          const segs = [
            { key: 'solar', v: m.solar },
            { key: 'drive', v: m.drive },
            { key: 'hookup', v: m.hookup },
          ]
          let acc = 0
          const supply = m.solar + m.drive + m.hookup
          const short = Math.max(0, use - supply)
          return (
            <g key={i} className={inTrip ? 'month' : 'month month-off'}>
              <title>
                {labels.monthTitle(
                  months.long[i],
                  fmt(m.solar),
                  fmt(m.drive),
                  fmt(m.hookup),
                  short > 0 ? labels.shortClause(fmt(short)) : '',
                )}
              </title>
              {segs.map((s) => {
                const y0 = y(acc)
                acc += s.v
                const y1 = y(acc)
                return s.v > 0 ? <rect key={s.key} className={`seg seg-${s.key}`} x={x} y={y1} width={bw} height={Math.max(0, y0 - y1)} /> : null
              })}
              {short > 0 && inTrip && (
                <rect className="seg seg-short" x={x} y={y(use)} width={bw} height={y(supply) - y(use)} />
              )}
              <text x={x + bw / 2} y={H - 12} textAnchor="middle" className={i === designMonth ? 'axis axis-strong' : 'axis'}>
                {slot < 34 ? months.short[i][0] : months.short[i]}
              </text>
            </g>
          )
        })}
        <line x1={left} x2={W - right} y1={y(use)} y2={y(use)} className="use-line" />
        <text x={W - right} y={y(use) - 8} textAnchor="end" className="use-label">
          {labels.useLine(fmt(use))}
        </text>
      </svg>
      <figcaption className="legend">
        <span><i className="key key-solar" />{labels.legendSun}</span>
        <span><i className="key key-drive" />{labels.legendDrive}</span>
        <span><i className="key key-hookup" />{labels.legendHookup}</span>
        <span><i className="key key-short" />{labels.legendShort}</span>
        <span className="legend-note">{labels.legendNote}</span>
      </figcaption>
      <details className="table-toggle">
        <summary>{labels.asTable}</summary>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{labels.colMonth}</th>
                <th scope="col">{labels.colSun}</th>
                <th scope="col">{labels.colDrive}</th>
                <th scope="col">{labels.colHookup}</th>
                <th scope="col">{labels.colBalance}</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m, i) => {
                const saldo = m.solar + m.drive + m.hookup - m.use
                return (
                  <tr key={i} className={travel.includes(i) ? '' : 'muted'}>
                    <th scope="row">{months.long[i]}</th>
                    <td className="num">{fmt(m.solar)} Wh</td>
                    <td className="num">{fmt(m.drive)} Wh</td>
                    <td className="num">{fmt(m.hookup)} Wh</td>
                    <td className={saldo < 0 ? 'num neg' : 'num pos'}>
                      {saldo >= 0 ? '+' : '−'}
                      {fmt(Math.abs(saldo))} Wh
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}

function niceTicks(max: number): number[] {
  const raw = max / 4
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
  const out: number[] = []
  for (let v = 0; v <= max; v += step) out.push(v)
  return out
}

/* ---------- Device breakdown ---------- */

export function DeviceBars({ lines, total }: { lines: DeviceLine[]; total: number }) {
  const { fmt } = useFormat()
  const sorted = [...lines].sort((a, b) => b.wh - a.wh)
  const max = sorted[0]?.wh ?? 1
  return (
    <ul className="bars">
      {sorted.map((l) => (
        <li key={l.id}>
          <span className="bar-name">
            {l.name}
            <span className={`tag tag-${l.supply}`}>{l.supply === 'dc' ? '12 V' : '230 V'}</span>
          </span>
          <span className="bar-track" aria-hidden="true">
            <span className={`bar-fill bar-fill-${l.supply}`} style={{ width: `${(l.wh / max) * 100}%` }} />
          </span>
          <span className="bar-value">
            {fmt(l.wh)} Wh <span className="muted">· {fmt((l.wh / total) * 100)}%</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

/* ---------- Battery days ---------- */

export function BatteryDays({ usableWh, dailyWh }: { usableWh: number; dailyWh: number }) {
  const { locale } = useRouter()
  const { fmt1 } = useFormat()
  const labels = chrome(locale).chart
  const days = dailyWh > 0 ? usableWh / dailyWh : 0
  const shown = Math.min(days, 7)
  const full = Math.floor(shown)
  const partial = shown - full
  const shownDays = fmt1(days)
  return (
    <div className="battery-days">
      <div className="battery-shell" role="img" aria-label={labels.batteryAlt(shownDays)}>
        {Array.from({ length: full }, (_, i) => (
          <span key={i} className="day-cell">
            <span>{labels.day(i + 1)}</span>
          </span>
        ))}
        {partial > 0.05 && (
          <span className="day-cell day-partial" style={{ flexGrow: partial }}>
            <span>
              {fmt1(partial * 24)} {locale === 'nl' ? 'u' : 'h'}
            </span>
          </span>
        )}
      </div>
      <p className="battery-caption">
        <strong className="num">{labels.daysWord(shownDays)}</strong> {labels.without}
        {days > 7 ? labels.weekCap : ''}.
      </p>
    </div>
  )
}
