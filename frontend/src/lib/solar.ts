export const MONTHS_SHORT = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'] as const

export const MONTHS_LONG = [
  'januari',
  'februari',
  'maart',
  'april',
  'mei',
  'juni',
  'juli',
  'augustus',
  'september',
  'oktober',
  'november',
  'december',
] as const

/**
 * Mean daily global irradiation on a horizontal plane, kWh/m²/day.
 * Source: PVGIS 5.2 (EU JRC), PVGIS-SARAH2, De Bilt (52.10 N, 5.18 E), monthly means 2013–2020.
 * A horizontal plane matches a flat-mounted panel on a camper roof.
 */
export const NL_IRRADIATION = [0.72, 1.49, 2.69, 4.35, 5.2, 5.39, 5.39, 4.53, 3.25, 1.78, 0.94, 0.58] as const

/** Losses for flat roof panels: heat, dirt, partial shade, MPPT and cabling. */
export const PERFORMANCE_RATIO = 0.75

export function solarWhPerDay(wp: number, month: number): number {
  return wp * NL_IRRADIATION[month] * PERFORMANCE_RATIO
}

/** The month with the least sun among the selected travel months. */
export function designMonth(months: readonly number[]): number {
  const list = months.length > 0 ? months : [5, 6, 7]
  return list.reduce((worst, m) => (NL_IRRADIATION[m] < NL_IRRADIATION[worst] ? m : worst), list[0])
}
