import { useEffect } from 'react'

export const SITE = {
  name: 'CamperPower',
  url: 'https://camperpower.nl',
  /** Leave empty until a real, monitored mailbox exists. */
  email: '',
}

function setAttr(selector: string, name: string, value: string) {
  document.querySelector(selector)?.setAttribute(name, value)
}

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const full = title === SITE.name ? `${SITE.name} · Stroom in je camper, zonder giswerk` : `${title} · ${SITE.name}`
    document.title = full
    setAttr('meta[name="description"]', 'content', description)
    setAttr('meta[property="og:title"]', 'content', full)
    setAttr('meta[property="og:description"]', 'content', description)
  }, [title, description])
}
