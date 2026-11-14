import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LanguageSwitch } from '../components/LanguageSwitch'
import { RouterContext } from '../lib/useRouter'
import { alternateLinks, languageSwitchHref, localizeHref, resolveNavigation, splitLocale } from './locale'

describe('splitLocale', () => {
  it('keeps Dutch on the current paths', () => {
    expect(splitLocale('/')).toEqual({ locale: 'nl', path: '/' })
    expect(splitLocale('/configurator')).toEqual({ locale: 'nl', path: '/configurator' })
    expect(splitLocale('/gidsen/verbruik-berekenen/')).toEqual({ locale: 'nl', path: '/gidsen/verbruik-berekenen' })
  })

  it('reads English from the /en prefix', () => {
    expect(splitLocale('/en')).toEqual({ locale: 'en', path: '/' })
    expect(splitLocale('/en/')).toEqual({ locale: 'en', path: '/' })
    expect(splitLocale('/en/configurator')).toEqual({ locale: 'en', path: '/configurator' })
    expect(splitLocale('/en/gidsen/kabels-en-zekeringen')).toEqual({
      locale: 'en',
      path: '/gidsen/kabels-en-zekeringen',
    })
  })

  it('does not treat a future language prefix as English', () => {
    expect(splitLocale('/de/configurator')).toEqual({ locale: 'nl', path: '/de/configurator' })
  })
})

describe('language switch', () => {
  it('keeps the page, the query and the hash', () => {
    expect(languageSwitchHref('/configurator', '?s=abc', '#kabel', 'en')).toBe('/en/configurator?s=abc#kabel')
    expect(languageSwitchHref('/gidsen/lifepo4-of-agm', '', '', 'en')).toBe('/en/gidsen/lifepo4-of-agm')
    expect(languageSwitchHref('/', '?s=1', '', 'nl')).toBe('/?s=1')
    expect(languageSwitchHref('/en/accu-leeg', '', '', 'nl')).toBe('/accu-leeg')
  })

  it('does not put a Dutch target back under /en', () => {
    expect(resolveNavigation('/gidsen/kabels-en-zekeringen', 'en', true)).toBe('/gidsen/kabels-en-zekeringen')
    expect(resolveNavigation('/configurator', 'en')).toBe('/en/configurator')
    expect(resolveNavigation('/en/configurator?s=abc', 'nl', true)).toBe('/en/configurator?s=abc')
  })

  it('keeps an explicit /en prefix when navigate localises again', () => {
    expect(localizeHref('/en/configurator?s=abc', 'nl')).toBe('/en/configurator?s=abc')
    expect(localizeHref('/configurator', 'en')).toBe('/en/configurator')
    expect(localizeHref('/configurator', 'nl')).toBe('/configurator')
  })

  it('points hreflang at the Dutch and English URLs, with Dutch as default', () => {
    expect(alternateLinks('/methode', 'https://camperpower.nl')).toEqual([
      { hreflang: 'nl', href: 'https://camperpower.nl/methode' },
      { hreflang: 'en', href: 'https://camperpower.nl/en/methode' },
      { hreflang: 'x-default', href: 'https://camperpower.nl/methode' },
    ])
  })
})

describe('LanguageSwitch', () => {
  function markup(path: string, locale: 'nl' | 'en', search = '') {
    return renderToStaticMarkup(
      <RouterContext.Provider value={{ path, search, locale, navigate: () => {} }}>
        <LanguageSwitch hash="" />
      </RouterContext.Provider>,
    )
  }

  it('links the other language to the same page', () => {
    const html = markup('/configurator', 'nl', '?s=abc')
    expect(html).toContain('href="/configurator?s=abc"')
    expect(html).toContain('href="/en/configurator?s=abc"')
    expect(html).toContain('aria-current="true"')
    expect(html).toContain('hrefLang="en"')
  })

  it('returns to the Dutch path from an English guide', () => {
    const html = markup('/gidsen/veilig-installeren', 'en')
    expect(html).toContain('href="/gidsen/veilig-installeren"')
    expect(html).toContain('href="/en/gidsen/veilig-installeren"')
  })
})
