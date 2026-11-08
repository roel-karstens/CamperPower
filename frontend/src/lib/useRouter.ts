import { createContext, useContext } from 'react'

export interface RouterValue {
  path: string
  search: string
  navigate: (to: string, opts?: { replace?: boolean }) => void
}

export const RouterContext = createContext<RouterValue | null>(null)

export function normalise(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter outside RouterProvider')
  return ctx
}
