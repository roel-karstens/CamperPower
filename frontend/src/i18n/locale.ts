/**
 * Language is a path prefix, not a separate store.
 * Dutch stays on the current paths (`/configurator`). English lives under `/en`
 * (`/en/configurator`). The same helper will grow `/de` and `/fr` later.
 *
 * A typed dictionary (not react-i18next) fits this custom router and the
 * planned prerender: each URL can be rendered from a static import, and a
 * missing translation is a type error. Guide bodies stay React, so links and
 * tables do not have to be squeezed through a string interpolator.
 */

export const LOCALES = ['nl', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'nl'

export const LOCALE_META: Record<
  Locale,
  { htmlLang: string; ogLocale: string; hreflang: string; label: string; short: string }
> = {
  nl: { htmlLang: 'nl', ogLocale: 'nl_NL', hreflang: 'nl', label: 'Nederlands', short: 'NL' },
  en: { htmlLang: 'en', ogLocale: 'en_GB', hreflang: 'en', label: 'English', short: 'EN' },
}

const PREFIX: Record<Locale, string> = { nl: '', en: '/en' }

export function normalisePath(path: string) {
  const bare = path.split(/[?#]/)[0] || '/'
  if (bare.length > 1 && bare.endsWith('/')) return bare.slice(0, -1)
  return bare || '/'
}

/** Split a pathname into a locale and the language-neutral path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const path = normalisePath(pathname)
  if (path === '/en' || path.startsWith('/en/')) {
    const rest = path.slice(3)
    return { locale: 'en', path: rest === '' ? '/' : rest }
  }
  return { locale: 'nl', path }
}

export function prefixPath(neutralPath: string, locale: Locale): string {
  const { path } = splitLocale(neutralPath.startsWith('/') ? neutralPath : `/${neutralPath}`)
  const prefix = PREFIX[locale]
  if (!prefix) return path
  return path === '/' ? prefix : `${prefix}${path}`
}

/**
 * Localise an in-app href. Query and hash are kept.
 * A path that already starts with `/en` keeps that language, so the language
 * switch survives a second pass through `navigate`.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href
  const hashAt = href.indexOf('#')
  const hash = hashAt >= 0 ? href.slice(hashAt) : ''
  const beforeHash = hashAt >= 0 ? href.slice(0, hashAt) : href
  const queryAt = beforeHash.indexOf('?')
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : ''
  const pathname = (queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash) || '/'
  const explicit = pathname === '/en' || pathname.startsWith('/en/')
  const split = splitLocale(pathname)
  return prefixPath(split.path, explicit ? split.locale : locale) + query + hash
}

/** Href for the same page in another language, including search and hash. */
/**
 * Final URL for `navigate`. A raw href is already localised (the language
 * switch). Anything else is a language-neutral path and takes the current locale.
 */
export function resolveNavigation(to: string, current: Locale, raw = false): string {
  if (!to.startsWith('/')) return to
  return raw ? to : localizeHref(to, current)
}

export function languageSwitchHref(neutralPath: string, search: string, hash: string, locale: Locale): string {
  const q = search ? (search.startsWith('?') ? search : `?${search}`) : ''
  const h = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : ''
  return prefixPath(neutralPath, locale) + q + h
}

export function alternateLinks(neutralPath: string, origin: string): { hreflang: string; href: string }[] {
  const page = (locale: Locale) => new URL(prefixPath(neutralPath, locale), origin).href
  return [
    ...LOCALES.map((locale) => ({ hreflang: LOCALE_META[locale].hreflang, href: page(locale) })),
    { hreflang: 'x-default', href: page(DEFAULT_LOCALE) },
  ]
}

export function joinList(items: readonly string[], locale: Locale): string {
  if (items.length <= 1) return items[0] ?? ''
  const conj = locale === 'nl' ? 'en' : 'and'
  return `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`
}
