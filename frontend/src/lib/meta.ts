import { useEffect } from 'react'
import { alternateLinks, LOCALE_META, localizeHref, type Locale } from '../i18n/locale'
import { useRouter } from './useRouter'

export const SITE = {
  name: 'CamperPower',
  url: 'https://camperpower.nl',
  /** Leave empty until a real, monitored mailbox exists. */
  email: '',
}

const HOME_TITLE: Record<Locale, string> = {
  nl: 'CamperPower · Stroom in je camper, zonder giswerk',
  en: 'CamperPower · Camper electrics, without the guesswork',
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function usePageMeta(title: string, description: string) {
  const { locale, path } = useRouter()
  useEffect(() => {
    const full = title === SITE.name ? HOME_TITLE[locale] : `${title} · ${SITE.name}`
    document.title = full
    document.documentElement.lang = LOCALE_META[locale].htmlLang
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:locale', LOCALE_META[locale].ogLocale)
    const other: Locale = locale === 'nl' ? 'en' : 'nl'
    setMeta('property', 'og:locale:alternate', LOCALE_META[other].ogLocale)
    setMeta('property', 'og:url', new URL(localizeHref(path, locale), SITE.url).href)
    setMeta(
      'property',
      'og:image:alt',
      locale === 'en'
        ? 'CamperPower: a cream camper in a mountain meadow in golden light'
        : 'CamperPower: een crème camper in een bergweide bij gouden licht',
    )

    const links = alternateLinks(path, SITE.url)
    const wanted = new Set(links.map((link) => link.hreflang))
    document.head.querySelectorAll('link[data-i18n="alt"]').forEach((node) => {
      const lang = node.getAttribute('hreflang')
      if (!lang || !wanted.has(lang)) node.remove()
    })
    for (const alt of links) {
      let el = document.head.querySelector(`link[data-i18n="alt"][hreflang="${alt.hreflang}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'alternate')
        el.setAttribute('data-i18n', 'alt')
        el.setAttribute('hreflang', alt.hreflang)
        document.head.appendChild(el)
      }
      el.setAttribute('href', alt.href)
    }
  }, [title, description, locale, path])
}
