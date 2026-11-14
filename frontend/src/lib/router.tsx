import { useCallback, useEffect, useMemo, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { localizeHref, resolveNavigation, splitLocale, type Locale } from '../i18n/locale'
import { RouterContext, normalise, useRouter } from './useRouter'

function current() {
  const { locale, path } = splitLocale(normalise(window.location.pathname))
  return { path, search: window.location.search, locale }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [loc, setLoc] = useState(current)

  useEffect(() => {
    const onPop = () => setLoc(current())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string, opts?: { replace?: boolean; raw?: boolean }) => {
    const url = new URL(resolveNavigation(to, loc.locale, opts?.raw), window.location.origin)
    if (opts?.replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
    setLoc(current())
    if (url.hash) {
      requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView())
    } else if (!opts?.replace) {
      window.scrollTo(0, 0)
      document.getElementById('main')?.focus({ preventScroll: true })
    }
  }, [loc.locale])

  const value = useMemo(() => ({ ...loc, navigate }), [loc, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  /** Prefix the href for this locale. Defaults to the language of the current page. */
  locale?: Locale
}

export function Link({ href, locale, onClick, children, ...rest }: LinkProps) {
  const { navigate, path, locale: current } = useRouter()
  const targetLocale = locale ?? current
  const internal = href.startsWith('/')
  const localized = internal ? localizeHref(href, targetLocale) : href
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (!internal || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(localized, { raw: true })
  }
  const neutral = internal ? splitLocale(href.split(/[?#]/)[0]).path : ''
  const isCurrent = internal && neutral === path && targetLocale === current
  return (
    <a
      href={localized}
      onClick={handle}
      aria-current={isCurrent ? 'page' : undefined}
      {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
    </a>
  )
}
