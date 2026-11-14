import {
  DEVICES,
  DRIVING_OPTIONS,
  HOOKUP_OPTIONS,
  type DeviceState,
  type DrivingPattern,
  type HookupPattern,
  type Supply,
} from '../data/devices'
import { marketForLocale } from '../data/markets'
import { deviceText } from '../i18n/catalog'
import { calcText } from '../i18n/calcText'
import type { Locale } from '../i18n/locale'
import { NL_IRRADIATION, PERFORMANCE_RATIO, designMonth } from './solar'

export const NOMINAL_V = 12.8
export const INVERTER_EFFICIENCY = 0.88
export const LIFEPO4_DOD = 0.9
export const AGM_DOD = 0.5
/** Max voltage drop as fraction of nominal voltage. */
export const MAX_DROP = 0.03
/** Resistivity of copper, Ω·mm²/m. */
export const RHO_COPPER = 0.0175

export const BATTERY_SIZES = [100, 150, 200, 230, 280, 300, 400, 460, 560, 600, 800] as const
export const MPPT_SIZES = [10, 15, 20, 30, 50, 70, 100] as const
export const DCDC_SIZES = [18, 30, 50] as const
export const CHARGER_SIZES = [15, 20, 30, 50] as const
export const INVERTER_SIZES = [300, 500, 800, 1200, 1600, 2000, 3000] as const
export const FUSE_SIZES = [5, 7.5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500] as const
/** Conservative continuous ampacity for flexible tinned copper with 105 °C insulation, in free air. */
export const CABLE_TABLE: readonly { mm2: number; amps: number }[] = [
  { mm2: 2.5, amps: 25 },
  { mm2: 4, amps: 35 },
  { mm2: 6, amps: 45 },
  { mm2: 10, amps: 65 },
  { mm2: 16, amps: 90 },
  { mm2: 25, amps: 125 },
  { mm2: 35, amps: 160 },
  { mm2: 50, amps: 200 },
  { mm2: 70, amps: 250 },
  { mm2: 95, amps: 300 },
  { mm2: 120, amps: 350 },
]

export type BatteryType = 'none' | 'agm' | 'lifepo4'
export type TriState = 'yes' | 'no' | 'unknown'

export interface Inputs {
  devices: DeviceState
  months: number[]
  reserveDays: number
  driving: DrivingPattern
  hookup: HookupPattern
  roofWp: number
  existingBattery: BatteryType
  existingAh: number
  ebl: TriState
  euro6: TriState
  starterCableM: number
}

export interface DeviceLine {
  id: string
  name: string
  supply: Supply
  watts: number
  hours: number
  /** Energy drawn from the battery per day, including inverter loss. */
  wh: number
}

export interface MonthBalance {
  month: number
  use: number
  solar: number
  drive: number
  hookup: number
}

export interface CableRun {
  id: string
  label: string
  amps: number
  lengthM: number
  mm2: number
  fuseA: number
  dropPct: number
}

export type ComponentKind = 'battery' | 'solar' | 'mppt' | 'dcdc' | 'charger' | 'inverter' | 'monitor' | 'wiring'

export interface Component {
  kind: ComponentKind
  title: string
  spec: string
  why: string
  priceLow: number
  priceHigh: number
  keep?: boolean
}

export type CheckLevel = 'stop' | 'warn' | 'info'

export interface Check {
  level: CheckLevel
  title: string
  body: string
  link?: { href: string; label: string }
}

export interface Result {
  lines: DeviceLine[]
  dailyWh: number
  acWh: number
  dcWh: number
  battery: { ah: number; usableWh: number; daysWithoutCharging: number; limitedBy: 'energy' | 'current' }
  solar: { wp: number; neededWp: number; capped: boolean; designMonth: number; whPerDayDesign: number }
  driveWhPerDay: number
  hookupShare: number
  monthly: MonthBalance[]
  designGapWh: number
  dcdcA: number
  mpptA: number
  chargerA: number
  inverterW: number
  inverterPeakA: number
  cables: CableRun[]
  components: Component[]
  checks: Check[]
  budget: { low: number; high: number; market: 'nl' }
}

export function nextSize<T extends number>(value: number, sizes: readonly T[]): T {
  return sizes.find((s) => s >= value) ?? sizes[sizes.length - 1]
}

function roundUp(value: number, step: number): number {
  return Math.ceil(value / step - 1e-9) * step
}

export function deviceLines(devices: DeviceState, locale: Locale = 'nl'): DeviceLine[] {
  return DEVICES.filter((d) => devices[d.id]?.on).map((d) => {
    const use = devices[d.id]
    const raw = use.watts * use.hours
    return {
      id: d.id,
      name: deviceText(d.id, locale, d).name,
      supply: d.supply,
      watts: use.watts,
      hours: use.hours,
      wh: d.supply === 'ac' ? raw / INVERTER_EFFICIENCY : raw,
    }
  })
}

export function inverterSize(lines: readonly DeviceLine[]): number {
  const ac = lines.filter((l) => l.supply === 'ac')
  if (ac.length === 0) return 0
  const largest = ac.reduce((a, b) => (b.watts > a.watts ? b : a))
  const smallLoads = ac.filter((l) => l !== largest && l.watts < 300).reduce((s, l) => s + l.watts, 0)
  return nextSize(largest.watts * 1.25 + smallLoads, INVERTER_SIZES)
}

export function sizeCable(id: string, label: string, amps: number, lengthM: number): CableRun {
  const dropV = NOMINAL_V * MAX_DROP
  const minForDrop = (2 * lengthM * amps * RHO_COPPER) / dropV
  const fuseA = nextSize(amps * 1.25, FUSE_SIZES)
  const cable =
    CABLE_TABLE.find((c) => c.mm2 >= minForDrop && c.amps >= fuseA) ?? CABLE_TABLE[CABLE_TABLE.length - 1]
  const dropPct = ((2 * lengthM * amps * RHO_COPPER) / cable.mm2 / NOMINAL_V) * 100
  return { id, label, amps: Math.round(amps), lengthM, mm2: cable.mm2, fuseA, dropPct: Math.round(dropPct * 10) / 10 }
}

function sizedPrice(value: number, table: readonly [number, number, number][]): [number, number] {
  const row = table.find(([max]) => value <= max) ?? table[table.length - 1]
  return [row[1], row[2]]
}

export function calculate(input: Inputs, locale: Locale = 'nl'): Result {
  const text = calcText(locale)
  const lines = deviceLines(input.devices, locale)
  const dailyWh = lines.reduce((s, l) => s + l.wh, 0)
  const acWh = lines.filter((l) => l.supply === 'ac').reduce((s, l) => s + l.wh, 0)
  const dcWh = dailyWh - acWh

  const inverterW = inverterSize(lines)
  const inverterPeakA = inverterW > 0 ? inverterW / (12 * INVERTER_EFFICIENCY) : 0

  // Battery: cover the reserve days, and deliver the inverter peak at max 1C.
  const energyAh = (dailyWh * input.reserveDays) / (NOMINAL_V * LIFEPO4_DOD)
  const ah = nextSize(Math.max(energyAh, inverterPeakA, 100), BATTERY_SIZES)
  const limitedBy = inverterPeakA > energyAh && nextSize(inverterPeakA, BATTERY_SIZES) === ah ? 'current' : 'energy'
  const usableWh = ah * NOMINAL_V * LIFEPO4_DOD

  // Charging while driving.
  const dcdcA = nextSize(ah * 0.2, DCDC_SIZES)
  const driveWhPerDay = dcdcA * NOMINAL_V * DRIVING_OPTIONS[input.driving].hoursPerDay * 0.9
  const hookupShare = HOOKUP_OPTIONS[input.hookup].share

  // Solar: size for the least sunny travel month.
  const month = designMonth(input.months)
  const solarNeedWh = Math.max(0, dailyWh * (1 - hookupShare) - driveWhPerDay)
  const neededWp = Math.max(100, roundUp(solarNeedWh / (NL_IRRADIATION[month] * PERFORMANCE_RATIO), 50))
  const roof = Math.max(50, Math.floor(input.roofWp / 50) * 50)
  const capped = neededWp > roof
  const wp = capped ? roof : neededWp
  const whPerDayDesign = wp * NL_IRRADIATION[month] * PERFORMANCE_RATIO
  const designGapWh = Math.max(0, solarNeedWh - whPerDayDesign)

  const monthly: MonthBalance[] = NL_IRRADIATION.map((h, m) => ({
    month: m,
    use: dailyWh,
    solar: wp * h * PERFORMANCE_RATIO,
    drive: driveWhPerDay,
    hookup: dailyWh * hookupShare,
  }))

  const mpptA = nextSize(wp / NOMINAL_V, MPPT_SIZES)
  const chargerA = nextSize(ah * 0.15, CHARGER_SIZES)

  const dcPeakA = Math.max(
    30,
    lines.filter((l) => l.supply === 'dc').reduce((s, l) => s + l.watts, 0) / 12,
  )

  const cables: CableRun[] = [
    sizeCable('starter', text.cable.starter, dcdcA * 1.1, input.starterCableM),
    sizeCable('dcdc', text.cable.dcdc, dcdcA, 1.5),
    sizeCable('mppt', text.cable.mppt, mpptA, 1.5),
    sizeCable('charger', text.cable.charger, chargerA, 1.5),
    sizeCable('dcloads', text.cable.dcloads, dcPeakA, 1.5),
  ]
  if (inverterW > 0) cables.push(sizeCable('inverter', text.cable.inverter, inverterPeakA, 1.5))

  const keepBattery = input.existingBattery === 'lifepo4' && input.existingAh >= ah
  const bms = Math.max(100, roundUp(Math.max(inverterPeakA, dcdcA + mpptA + chargerA), 50))
  const batteryCopy = text.battery(keepBattery, input.existingAh, ah, bms, limitedBy, input.reserveDays)
  const solarCopy = text.solar(wp, capped, month, neededWp, roof)
  const mpptCopy = text.mppt(mpptA, wp, Math.round(wp / NOMINAL_V))
  const dcdcCopy = text.dcdc(dcdcA, input.euro6, Math.round(driveWhPerDay))
  const chargerCopy = text.charger(chargerA, input.ebl)

  const components: Component[] = [
    {
      kind: 'battery',
      ...batteryCopy,
      priceLow: keepBattery ? 0 : Math.round(ah * 3),
      priceHigh: keepBattery ? 0 : Math.round(ah * 9),
      keep: keepBattery,
    },
    {
      kind: 'solar',
      ...solarCopy,
      // TODO(i18n): these multipliers are the Dutch market. See data/markets.ts.
      priceLow: Math.round(wp * 0.8 + 80),
      priceHigh: Math.round(wp * 2 + 200),
    },
    {
      kind: 'mppt',
      ...mpptCopy,
      ...priceRange(mpptA, [
        [20, 90, 160],
        [30, 140, 230],
        [50, 230, 380],
        [70, 350, 550],
        [100, 500, 750],
      ]),
    },
    {
      kind: 'dcdc',
      ...dcdcCopy,
      ...priceRange(dcdcA, [
        [18, 120, 220],
        [30, 150, 300],
        [50, 250, 450],
      ]),
    },
    {
      kind: 'charger',
      ...chargerCopy,
      ...priceRange(chargerA, [
        [20, 100, 250],
        [30, 150, 350],
        [50, 300, 550],
      ]),
    },
  ]
  if (inverterW > 0) {
    const acPeak = Math.max(...lines.filter((l) => l.supply === 'ac').map((l) => l.watts))
    const inverterCopy = text.inverter(inverterW, acPeak)
    components.push({
      kind: 'inverter',
      ...inverterCopy,
      priceLow: Math.round(inverterW * 0.15 + 50),
      priceHigh: Math.round(inverterW * 0.6 + 100),
    })
  }
  const shunt = nextSize(Math.max(inverterPeakA, 100) * 1.5, [300, 500, 1000])
  const monitorCopy = text.monitor(shunt)
  const wiringCopy = text.wiring(Math.max(...cables.map((c) => c.mm2)), Math.max(...cables.map((c) => c.fuseA)))
  components.push(
    {
      kind: 'monitor',
      ...monitorCopy,
      priceLow: 60,
      priceHigh: 200,
    },
    {
      kind: 'wiring',
      ...wiringCopy,
      priceLow: inverterW >= 2000 ? 200 : 120,
      priceHigh: inverterW >= 2000 ? 450 : 350,
    },
  )

  const checks = buildChecks(input, { ah, wp, neededWp, capped, month, designGapWh, usableWh, inverterW, inverterPeakA, limitedBy, keepBattery }, locale)

  const budget = components.reduce(
    (acc, c) => ({ low: acc.low + c.priceLow, high: acc.high + c.priceHigh }),
    { low: 0, high: 0 },
  )

  return {
    lines,
    dailyWh,
    acWh,
    dcWh,
    battery: { ah, usableWh, daysWithoutCharging: dailyWh > 0 ? usableWh / dailyWh : Infinity, limitedBy },
    solar: { wp, neededWp, capped, designMonth: month, whPerDayDesign },
    driveWhPerDay,
    hookupShare,
    monthly,
    designGapWh,
    dcdcA,
    mpptA,
    chargerA,
    inverterW,
    inverterPeakA,
    cables,
    components,
    checks,
    budget: { low: roundUp(budget.low, 50), high: roundUp(budget.high, 50), market: marketForLocale(locale) },
  }
}

function priceRange(value: number, table: readonly [number, number, number][]) {
  const [priceLow, priceHigh] = sizedPrice(value, table)
  return { priceLow, priceHigh }
}

interface CheckContext {
  ah: number
  wp: number
  neededWp: number
  capped: boolean
  month: number
  designGapWh: number
  usableWh: number
  inverterW: number
  inverterPeakA: number
  limitedBy: 'energy' | 'current'
  keepBattery: boolean
}

function buildChecks(input: Inputs, c: CheckContext, locale: Locale): Check[] {
  const text = calcText(locale).checks
  const checks: Check[] = []

  if (input.existingBattery === 'agm') checks.push({ level: 'stop', ...text.agm() })

  if (input.ebl !== 'no' && !c.keepBattery) checks.push({ level: 'warn', ...text.ebl(input.ebl === 'yes') })

  if (input.euro6 !== 'no') checks.push({ level: 'warn', ...text.euro6(input.euro6 === 'yes') })

  if (c.capped) {
    checks.push({
      level: 'warn',
      ...text.roof(c.month, c.neededWp, c.wp, Math.round(c.designGapWh), Math.floor(c.usableWh / Math.max(c.designGapWh, 1))),
    })
  }

  if (input.months.some((m) => m <= 1 || m >= 10)) checks.push({ level: 'info', ...text.winter() })

  if (c.limitedBy === 'current') checks.push({ level: 'info', ...text.current(Math.round(c.inverterPeakA)) })

  if (c.inverterW >= 2000) {
    checks.push({ level: 'warn', ...text.bigInverter(c.inverterW, Math.round(c.inverterPeakA)) })
  }

  if (input.existingBattery === 'lifepo4' && !c.keepBattery && input.existingAh > 0) {
    checks.push({ level: 'info', ...text.second() })
  }

  checks.push({ level: 'info', ...text.disclaimer() })

  return checks
}
