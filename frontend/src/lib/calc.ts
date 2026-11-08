import {
  DEVICES,
  DRIVING_OPTIONS,
  HOOKUP_OPTIONS,
  type DeviceState,
  type DrivingPattern,
  type HookupPattern,
  type Supply,
} from '../data/devices'
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
  budget: { low: number; high: number }
}

export function nextSize<T extends number>(value: number, sizes: readonly T[]): T {
  return sizes.find((s) => s >= value) ?? sizes[sizes.length - 1]
}

function roundUp(value: number, step: number): number {
  return Math.ceil(value / step - 1e-9) * step
}

export function deviceLines(devices: DeviceState): DeviceLine[] {
  return DEVICES.filter((d) => devices[d.id]?.on).map((d) => {
    const use = devices[d.id]
    const raw = use.watts * use.hours
    return {
      id: d.id,
      name: d.name,
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

export function calculate(input: Inputs): Result {
  const lines = deviceLines(input.devices)
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
    sizeCable('starter', 'Startaccu → DC-DC-lader', dcdcA * 1.1, input.starterCableM),
    sizeCable('dcdc', 'DC-DC-lader → accu', dcdcA, 1.5),
    sizeCable('mppt', 'Zonnelaadregelaar → accu', mpptA, 1.5),
    sizeCable('charger', 'Walstroomlader → accu', chargerA, 1.5),
    sizeCable('dcloads', 'Accu → zekeringkast 12 V', dcPeakA, 1.5),
  ]
  if (inverterW > 0) cables.push(sizeCable('inverter', 'Accu → omvormer', inverterPeakA, 1.5))

  const keepBattery = input.existingBattery === 'lifepo4' && input.existingAh >= ah

  const components: Component[] = [
    {
      kind: 'battery',
      title: keepBattery ? 'Je huidige LiFePO4-accu' : 'LiFePO4-accu',
      spec: keepBattery ? `${input.existingAh} Ah volstaat (nodig: ${ah} Ah)` : `${ah} Ah, 12,8 V, BMS ≥ ${Math.max(100, roundUp(Math.max(inverterPeakA, dcdcA + mpptA + chargerA), 50))} A`,
      why:
        limitedBy === 'current'
          ? 'Groter dan je verbruik vraagt, zodat de accu de stroom voor de omvormer kan leveren.'
          : `Ontworpen op ${input.reserveDays} ${input.reserveDays === 1 ? 'dag' : 'dagen'} zonder laden, met 10% marge onderin, afgerond naar een gangbare maat.`,
      priceLow: keepBattery ? 0 : Math.round(ah * 3),
      priceHigh: keepBattery ? 0 : Math.round(ah * 9),
      keep: keepBattery,
    },
    {
      kind: 'solar',
      title: 'Zonnepanelen',
      spec: `${wp} Wp, vlak op het dak`,
      why: capped
        ? `Zoveel past er op je dak. In ${monthName(month)} is ${neededWp} Wp nodig.`
        : roof > wp
          ? `Genoeg voor ${monthName(month)}, je minst zonnige reismaand. Er past ${roof} Wp op je dak: meer paneel geeft marge voor dagen dat je stilstaat.`
          : `Genoeg voor ${monthName(month)}, je minst zonnige reismaand.`,
      priceLow: Math.round(wp * 0.8 + 80),
      priceHigh: Math.round(wp * 2 + 200),
    },
    {
      kind: 'mppt',
      title: 'MPPT-zonnelaadregelaar',
      spec: `${mpptA} A, ingang 75 of 100 V`,
      why: `${wp} Wp ÷ 12,8 V ≈ ${Math.round(wp / NOMINAL_V)} A laadstroom.`,
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
      title: 'DC-DC-lader',
      spec: `${dcdcA} A${input.euro6 !== 'no' ? ', geschikt voor slimme dynamo (Euro 6)' : ''}`,
      why: `Laadt je accu tijdens het rijden met ongeveer ${Math.round(driveWhPerDay)} Wh per dag.`,
      ...priceRange(dcdcA, [
        [18, 120, 220],
        [30, 150, 300],
        [50, 250, 450],
      ]),
    },
    {
      kind: 'charger',
      title: 'Walstroomlader',
      spec: `${chargerA} A met LiFePO4-profiel`,
      why:
        input.ebl === 'yes'
          ? 'Alleen nodig als je EBL geen lithiumprofiel heeft.'
          : 'Volladen op de camping of thuis.',
      ...priceRange(chargerA, [
        [20, 100, 250],
        [30, 150, 350],
        [50, 300, 550],
      ]),
    },
  ]
  if (inverterW > 0) {
    components.push({
      kind: 'inverter',
      title: 'Omvormer',
      spec: `${inverterW} W zuivere sinus`,
      why: `Voor je 230V-apparaten. Grootste piek: ${Math.max(...lines.filter((l) => l.supply === 'ac').map((l) => l.watts))} W.`,
      priceLow: Math.round(inverterW * 0.15 + 50),
      priceHigh: Math.round(inverterW * 0.6 + 100),
    })
  }
  components.push(
    {
      kind: 'monitor',
      title: 'Accumonitor met shunt',
      spec: `${nextSize(Math.max(inverterPeakA, 100) * 1.5, [300, 500, 1000])} A shunt`,
      why: 'Laat zien hoeveel er écht in je accu zit. De spanning alleen zegt bij lithium weinig.',
      priceLow: 60,
      priceHigh: 200,
    },
    {
      kind: 'wiring',
      title: 'Kabels, zekeringen en hoofdschakelaar',
      spec: `${Math.max(...cables.map((c) => c.mm2))} mm² dikste kabel, hoofdzekering ${Math.max(...cables.map((c) => c.fuseA))} A`,
      why: 'Elke plus-kabel krijgt een zekering zo dicht mogelijk bij de accu.',
      priceLow: inverterW >= 2000 ? 200 : 120,
      priceHigh: inverterW >= 2000 ? 450 : 350,
    },
  )

  const checks = buildChecks(input, { ah, wp, neededWp, capped, month, designGapWh, usableWh, inverterW, inverterPeakA, limitedBy, keepBattery })

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
    budget: { low: roundUp(budget.low, 50), high: roundUp(budget.high, 50) },
  }
}

function priceRange(value: number, table: readonly [number, number, number][]) {
  const [priceLow, priceHigh] = sizedPrice(value, table)
  return { priceLow, priceHigh }
}

const MONTH_NAMES = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
function monthName(m: number) {
  return MONTH_NAMES[m]
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

function buildChecks(input: Inputs, c: CheckContext): Check[] {
  const checks: Check[] = []

  if (input.existingBattery === 'agm') {
    checks.push({
      level: 'stop',
      title: 'Combineer lithium niet met je AGM-accu',
      body: 'Vervang de AGM-accu in zijn geheel. Parallel schakelen met LiFePO4 geeft ongelijke laadstromen en kan beide accu’s beschadigen.',
      link: { href: '/gidsen/lifepo4-of-agm', label: 'LiFePO4 of AGM' },
    })
  }

  if (input.ebl !== 'no' && !c.keepBattery) {
    checks.push({
      level: 'warn',
      title: input.ebl === 'yes' ? 'Controleer je EBL vóór je overstapt' : 'Zit er een EBL in je camper?',
      body: 'Veel oudere elektroblokken (Schaudt, Nordelettronica, CBE) laden met een loodaccu-profiel. Dat is te laag of te hoog voor LiFePO4.',
      link: { href: '/lithium-check', label: 'Doe de lithium-check' },
    })
  }

  if (input.euro6 !== 'no') {
    checks.push({
      level: 'warn',
      title: input.euro6 === 'yes' ? 'Slimme dynamo: kies de juiste DC-DC-lader' : 'Weet je of je camper een slimme dynamo heeft?',
      body: 'Bij Euro 6 en de meeste campers vanaf 2015 zakt de dynamospanning tijdens het rijden. De DC-DC-lader moet dan op het motorsignaal schakelen, niet alleen op spanning.',
      link: { href: '/gidsen/dc-dc-lader', label: 'Over DC-DC-laders' },
    })
  }

  if (c.capped) {
    checks.push({
      level: 'warn',
      title: `Je dak is te klein voor ${monthName(c.month)}`,
      body: `Je hebt ${c.neededWp} Wp nodig, maar er past ${c.wp} Wp. Je mist dan ongeveer ${Math.round(c.designGapWh)} Wh per dag. Je volle accu overbrugt dat ${Math.floor(c.usableWh / Math.max(c.designGapWh, 1))} dagen, daarna moet je rijden of walstroom pakken.`,
    })
  }

  if (input.months.some((m) => m <= 1 || m >= 10)) {
    checks.push({
      level: 'info',
      title: 'Winterreizen vragen om een accu met verwarming',
      body: 'LiFePO4 mag niet laden onder 0 °C. Kies een accu met ingebouwde verwarming of plaats hem binnen in de camper. In de winter levert zon bovendien weinig op.',
    })
  }

  if (c.limitedBy === 'current') {
    checks.push({
      level: 'info',
      title: 'De omvormer bepaalt je accugrootte',
      body: `Je omvormer trekt tot ${Math.round(c.inverterPeakA)} A. Een kleinere accu kan dat vaak niet leveren. Wil je een kleinere accu? Laat dan het zwaarste 230V-apparaat thuis.`,
    })
  }

  if (c.inverterW >= 2000) {
    checks.push({
      level: 'warn',
      title: 'Grote stromen: laat dit door een vakman aansluiten',
      body: `Een omvormer van ${c.inverterW} W trekt meer dan ${Math.round(c.inverterPeakA)} A. Een losse kabelschoen kan dan warm worden en brand veroorzaken.`,
      link: { href: '/gidsen/veilig-installeren', label: 'Veilig installeren' },
    })
  }

  if (input.existingBattery === 'lifepo4' && !c.keepBattery && input.existingAh > 0) {
    checks.push({
      level: 'info',
      title: 'Uitbreiden met een tweede accu?',
      body: 'Kan, mits het hetzelfde merk, type en dezelfde leeftijd is. Anders: vervangen door één grotere accu.',
    })
  }

  checks.push({
    level: 'info',
    title: 'Dit is een indicatie, geen installatieplan',
    body: 'We rekenen met gemiddelden. Laat de aansluiting en zekeringen controleren door een vakman voor je de stroom inschakelt.',
    link: { href: '/methode', label: 'Zo rekenen wij' },
  })

  return checks
}
