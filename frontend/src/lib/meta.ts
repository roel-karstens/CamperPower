import { useEffect } from 'react'

export const SITE = {
  name: 'CamperPower',
  url: 'https://camperpower.nl',
  /** Leave empty until a real, monitored mailbox exists. */
  email: '',
}

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title === SITE.name ? `${SITE.name} · Stroom in je camper, zonder giswerk` : `${title} · ${SITE.name}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
