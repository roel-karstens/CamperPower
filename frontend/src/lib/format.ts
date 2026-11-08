const int = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 0 })
const one = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 })
const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export const fmt = (n: number) => int.format(n)
export const fmt1 = (n: number) => one.format(n)
export const euro = (n: number) => eur.format(n)

export function kwh(wh: number) {
  return wh >= 1000 ? `${one.format(wh / 1000)} kWh` : `${int.format(wh)} Wh`
}
