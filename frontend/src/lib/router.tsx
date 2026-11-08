import { useCallback, useEffect, useMemo, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { RouterContext, normalise, useRouter } from './useRouter'

function current() {
  return { path: normalise(window.location.pathname), search: window.location.search }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [loc, setLoc] = useState(current)

  useEffect(() => {
    const onPop = () => setLoc(current())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin)
    if (opts?.replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
    setLoc(current())
    if (url.hash) {
      requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView())
    } else if (!opts?.replace) {
      window.scrollTo(0, 0)
      document.getElementById('main')?.focus({ preventScroll: true })
    }
  }, [])

  const value = useMemo(() => ({ ...loc, navigate }), [loc, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const { navigate, path } = useRouter()
  const internal = href.startsWith('/')
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (!internal || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }
  const isCurrent = internal && normalise(href.split(/[?#]/)[0]) === path
  return (
    <a
      href={href}
      onClick={handle}
      aria-current={isCurrent ? 'page' : undefined}
      {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
    </a>
  )
}
