import { createContext, useContext } from 'react'
import type { Locale } from '../i18n/locale'

export interface RouterValue {
  /** Language-neutral path, such as `/configurator` on both `/configurator` and `/en/configurator`. */
  path: string
  search: string
  locale: Locale
  navigate: (to: string, opts?: { replace?: boolean; raw?: boolean }) => void
}

export const RouterContext = createContext<RouterValue | null>(null)

export function normalise(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path || '/'
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter outside RouterProvider')
  return ctx
}
