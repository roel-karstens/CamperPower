import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Guide } from '../data/guides'
import { displayImage } from '../i18n/images'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function GuideReel({
  guides,
  minutes,
  label,
  prevLabel,
  nextLabel,
}: {
  guides: readonly Guide[]
  minutes: (n: number) => string
  label: string
  prevLabel: string
  nextLabel: string
}) {
  const { locale } = useRouter()
  const scroller = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState<'start' | 'end' | 'mid' | 'none'>('start')

  function updateEdge() {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 4) setEdge('none')
    else if (el.scrollLeft <= 4) setEdge('start')
    else if (el.scrollLeft >= max - 4) setEdge('end')
    else setEdge('mid')
  }

  function scrollByCard(direction: -1 | 1) {
    const el = scroller.current
    const card = el?.querySelector<HTMLElement>('.reel-card')
    if (!el || !card) return
    const gap = 16
    el.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reducedMotion() ? 'auto' : 'smooth',
    })
  }

  useEffect(() => {
    updateEdge()
  }, [guides])

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollByCard(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollByCard(-1)
    }
  }

  return (
    <div className="reel">
      <div
        ref={scroller}
        className="guide-reel"
        tabIndex={0}
        role="region"
        aria-label={label}
        onScroll={updateEdge}
        onKeyDown={onKey}
      >
        {guides.map((g) => {
          const image = g.image ? displayImage(g.image, locale) : undefined
          const width = image?.widths.includes(800) ? 800 : image?.widths[0]
          return (
            <Link key={g.slug} href={`/gidsen/${g.slug}`} className="reel-card">
              {image && width && (
                <img
                  src={`${image.src}-${width}.webp`}
                  srcSet={image.widths.map((w) => `${image.src}-${w}.webp ${w}w`).join(', ')}
                  sizes="280px"
                  alt={image.alt}
                  width={width}
                  height={Math.round(width / image.ratio)}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="reel-copy">
                <span className="card-meta">{minutes(g.minutes)}</span>
                <span className="card-title">{g.title}</span>
                <span className="card-text">{g.summary}</span>
              </span>
            </Link>
          )
        })}
      </div>
      <div className="reel-nav">
        <button type="button" className="reel-btn" onClick={() => scrollByCard(-1)} disabled={edge === 'start' || edge === 'none'} aria-label={prevLabel}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M11 4L6 9l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="reel-btn" onClick={() => scrollByCard(1)} disabled={edge === 'end' || edge === 'none'} aria-label={nextLabel}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M7 4l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
