import { languageSwitchHref, LOCALE_META, LOCALES } from '../i18n/locale'
import { chrome } from '../i18n/chrome'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'

export function LanguageSwitch({ hash = '' }: { hash?: string }) {
  const { path, search, locale } = useRouter()
  const liveHash = hash || (typeof window !== 'undefined' ? window.location.hash : '')
  const t = chrome(locale)
  return (
    <nav className="lang-switch" aria-label={t.langNav}>
      {LOCALES.map((code) => (
        <Link
          key={code}
          href={languageSwitchHref(path, search, liveHash, code)}
          locale={code}
          hrefLang={LOCALE_META[code].hreflang}
          lang={LOCALE_META[code].htmlLang}
          aria-current={code === locale ? 'true' : undefined}
        >
          <span aria-hidden="true">{LOCALE_META[code].short}</span>
          <span className="sr-only">{LOCALE_META[code].label}</span>
        </Link>
      ))}
    </nav>
  )
}
