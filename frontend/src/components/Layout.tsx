import { useEffect, useState } from 'react'
import { LanguageSwitch } from './LanguageSwitch'
import { chrome } from '../i18n/chrome'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'

function ThemeToggle() {
  const { locale } = useRouter()
  const label = chrome(locale)
  const [explicit, setExplicit] = useState<'light' | 'dark' | null>(() => {
    const t = document.documentElement.dataset.theme
    return t === 'light' || t === 'dark' ? t : null
  })
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme = explicit ?? (systemDark ? 'dark' : 'light')

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setExplicit(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('camperpower.theme', next)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#14110C' : '#F6F0E4')
  }

  const toDark = theme !== 'dark'
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-pressed={theme === 'dark'}>
      <span className="sr-only">{toDark ? label.themeDark : label.themeLight}</span>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        {toDark ? (
          <>
            <circle cx="9" cy="9" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M9 1.4v1.7M9 14.9v1.7M1.4 9h1.7M14.9 9h1.7M3.5 3.5l1.2 1.2M13.3 13.3l1.2 1.2M14.5 3.5l-1.2 1.2M4.7 13.3l-1.2 1.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path d="M10.1 1.8A6.4 6.4 0 1 0 16.2 11.6 5 5 0 0 1 10.1 1.8Z" fill="currentColor" />
        )}
      </svg>
    </button>
  )
}

export function Logo() {
  const { locale } = useRouter()
  return (
    <Link href="/" className="logo" aria-label={chrome(locale).logo}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="2" fill="var(--accent)" />
        <rect x="6" y="10" width="14" height="10" rx="1.5" fill="none" stroke="var(--accent-fg)" strokeWidth="1.6" />
        <rect x="20.5" y="13" width="2" height="4" rx="0.6" fill="var(--accent-fg)" />
        <rect x="8.2" y="12.2" width="6.2" height="5.4" rx="0.6" fill="var(--mark)" />
        <circle cx="20" cy="6.6" r="2" fill="var(--footer-hover)" />
      </svg>
      <span>CamperPower</span>
    </Link>
  )
}

export function Header() {
  const { path, locale } = useRouter()
  const t = chrome(locale)
  const here = `${locale}${path}`
  const [open, setOpen] = useState(false)
  const [lastHere, setLastHere] = useState(here)

  if (lastHere !== here) {
    setLastHere(here)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Logo />
        <nav aria-label={t.navLabel} className="nav-desktop">
          {t.nav.map((n) => (
            <Link key={n.href} href={n.href} className="nav-link">
              {n.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitch />
        <ThemeToggle />
        <Link href="/configurator" className="btn btn-primary btn-sm header-cta">
          {t.cta}
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? t.closeMenu : t.openMenu}</span>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {open ? (
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 7h16M3 15h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label={t.mobileNav} className="nav-mobile">
          <div className="wrap">
            {t.nav.map((n) => (
              <Link key={n.href} href={n.href} className="nav-mobile-link">
                {n.label}
              </Link>
            ))}
            <Link href="/configurator" className="btn btn-primary">
              {t.cta}
            </Link>
            <LanguageSwitch />
          </div>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  const { locale } = useRouter()
  const t = chrome(locale)
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p className="footer-note">{t.footerNote}</p>
        </div>
        <div>
          <h2 className="footer-title">{t.footerCalc}</h2>
          <ul>
            {t.footerLinks.calc.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">{t.footerLearn}</h2>
          <ul>
            {t.footerLinks.learn.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-title">{t.footerAbout}</h2>
          <ul>
            {t.footerLinks.about.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© {new Date().getFullYear()} CamperPower</span>
        <span>{t.cookies}</span>
      </div>
    </footer>
  )
}
