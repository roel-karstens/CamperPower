import type { Locale } from '../i18n/locale'
import { useRouter } from './useRouter'

export interface Formatters {
  fmt: (n: number) => string
  fmt1: (n: number) => string
  /** Up to two fraction digits. Use for irradiation and ratios. */
  num: (n: number) => string
  euro: (n: number) => string
  kwh: (wh: number) => string
  /** Short unit for “hours”, used in the device stepper. */
  hoursUnit: string
}

const cache = new Map<Locale, Formatters>()

export function createFormat(locale: Locale): Formatters {
  const hit = cache.get(locale)
  if (hit) return hit
  const tag = locale === 'nl' ? 'nl-NL' : 'en-GB'
  const int = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 })
  const one = new Intl.NumberFormat(tag, { maximumFractionDigits: 1 })
  const dec = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 })
  const eur = new Intl.NumberFormat(tag, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  const formatters: Formatters = {
    fmt: (n) => int.format(n),
    fmt1: (n) => one.format(n),
    num: (n) => dec.format(n),
    euro: (n) => eur.format(n),
    kwh: (wh) => (wh >= 1000 ? `${one.format(wh / 1000)} kWh` : `${int.format(wh)} Wh`),
    hoursUnit: locale === 'nl' ? 'u' : 'h',
  }
  cache.set(locale, formatters)
  return formatters
}

const dutch = createFormat('nl')
export const fmt = dutch.fmt
export const fmt1 = dutch.fmt1
export const euro = dutch.euro
export const kwh = dutch.kwh

export function useFormat(): Formatters {
  const { locale } = useRouter()
  return createFormat(locale)
}
