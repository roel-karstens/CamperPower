import { describe, expect, it } from 'vitest'
import { defaultDevices } from '../data/devices'
import { calculate, inverterSize, nextSize, sizeCable, deviceLines, type Inputs } from './calc'
import { designMonth, solarWhPerDay } from './solar'

function inputs(over: Partial<Inputs> = {}): Inputs {
  return {
    devices: defaultDevices(['fridge', 'lights', 'phones', 'pump']),
    months: [5, 6, 7],
    reserveDays: 2,
    driving: 'rarely',
    hookup: 'never',
    roofWp: 400,
    existingBattery: 'none',
    existingAh: 0,
    ebl: 'no',
    euro6: 'no',
    starterCableM: 5,
    ...over,
  }
}

describe('nextSize', () => {
  it('picks the smallest standard size that fits', () => {
    expect(nextSize(101, [100, 150, 200])).toBe(150)
    expect(nextSize(100, [100, 150, 200])).toBe(100)
  })
  it('falls back to the largest size', () => {
    expect(nextSize(999, [100, 150, 200])).toBe(200)
  })
})

describe('device energy', () => {
  it('sums watts × hours and adds inverter loss for 230 V', () => {
    const devices = defaultDevices(['fridge', 'laptop'])
    const lines = deviceLines(devices)
    expect(lines.find((l) => l.id === 'fridge')?.wh).toBe(480)
    expect(lines.find((l) => l.id === 'laptop')?.wh).toBeCloseTo(180 / 0.88, 5)
  })
})

describe('battery', () => {
  it('covers reserve days at 90% depth of discharge', () => {
    // 480 + 50 + 30 + 25 = 585 Wh/day × 2 days / (12.8 V × 0.9) = 101.6 Ah → 150 Ah
    const r = calculate(inputs())
    expect(r.dailyWh).toBe(585)
    expect(r.battery.ah).toBe(150)
    expect(r.battery.limitedBy).toBe('energy')
  })

  it('grows when the inverter needs more current than the energy requires', () => {
    const devices = defaultDevices(['lights', 'induction'])
    const r = calculate(inputs({ devices, reserveDays: 1 }))
    // 1500 W × 1.25 → 2000 W inverter → 2000 / (12 × 0.88) = 189 A
    expect(r.inverterW).toBe(2000)
    expect(r.battery.ah).toBe(200)
    expect(r.battery.limitedBy).toBe('current')
  })

  it('keeps an existing LiFePO4 battery that is large enough', () => {
    const r = calculate(inputs({ existingBattery: 'lifepo4', existingAh: 200 }))
    expect(r.components[0].keep).toBe(true)
    expect(r.components[0].priceHigh).toBe(0)
  })
})

describe('solar', () => {
  it('uses the least sunny travel month', () => {
    expect(designMonth([4, 5, 8])).toBe(8)
    expect(designMonth([])).toBe(7)
  })

  it('sizes panels from PVGIS irradiation and performance ratio', () => {
    // 585 Wh − drive (30 A × 12.8 V × 0.25 h × 0.9 = 86.4 Wh) = 498.6 Wh
    // design month August 4.53 kWh/m² × 0.75 → 498.6 / 3.3975 = 147 Wp → 150 Wp
    const r = calculate(inputs())
    expect(r.dcdcA).toBe(30)
    expect(r.solar.designMonth).toBe(7)
    expect(r.solar.neededWp).toBe(150)
    expect(r.solar.capped).toBe(false)
  })

  it('caps at roof space and reports the daily gap', () => {
    const r = calculate(inputs({ months: [9], roofWp: 200 }))
    expect(r.solar.capped).toBe(true)
    expect(r.solar.wp).toBe(200)
    expect(r.designGapWh).toBeGreaterThan(0)
    expect(r.checks.some((c) => c.title.includes('dak is te klein'))).toBe(true)
  })

  it('needs less sun with campsite hookup', () => {
    const never = calculate(inputs({ months: [3] }))
    const mostly = calculate(inputs({ months: [3], hookup: 'mostly' }))
    expect(mostly.solar.neededWp).toBeLessThan(never.solar.neededWp)
  })

  it('produces Wh per day consistent with the formula', () => {
    expect(solarWhPerDay(100, 6)).toBeCloseTo(100 * 5.39 * 0.75, 5)
  })
})

describe('chargers', () => {
  it('sizes the MPPT from Wp / 12.8 V', () => {
    const r = calculate(inputs({ months: [3], roofWp: 600 }))
    expect(r.mpptA).toBeGreaterThanOrEqual(r.solar.wp / 12.8)
  })
})

describe('inverter', () => {
  it('is not needed without 230 V devices', () => {
    expect(inverterSize(deviceLines(defaultDevices(['fridge'])))).toBe(0)
  })
  it('covers the largest device plus small 230 V loads', () => {
    // coffee 1000 × 1.25 + laptop 60 = 1310 → 1600
    expect(inverterSize(deviceLines(defaultDevices(['coffee', 'laptop'])))).toBe(1600)
  })
})

describe('cables', () => {
  it('limits voltage drop to 3% and protects with a matching fuse', () => {
    const run = sizeCable('x', 'test', 50, 5)
    // drop: 2 × 5 × 50 × 0.0175 / 0.384 = 22.8 mm² → 25 mm²
    expect(run.mm2).toBe(25)
    expect(run.fuseA).toBe(70)
    expect(run.dropPct).toBeLessThanOrEqual(3)
  })

  it('never fuses above the cable ampacity', () => {
    const run = sizeCable('x', 'test', 190, 1)
    expect(run.fuseA).toBe(250)
    expect(run.mm2).toBe(70)
  })
})

describe('checks', () => {
  it('blocks mixing AGM with lithium', () => {
    const r = calculate(inputs({ existingBattery: 'agm', existingAh: 95 }))
    expect(r.checks[0].level).toBe('stop')
  })
  it('flags the EBL and Euro 6 when unknown', () => {
    const r = calculate(inputs({ ebl: 'unknown', euro6: 'unknown' }))
    expect(r.checks.filter((c) => c.level === 'warn')).toHaveLength(2)
  })
  it('always ends with the professional-check notice', () => {
    const r = calculate(inputs())
    expect(r.checks[r.checks.length - 1].title).toContain('indicatie')
  })
})
