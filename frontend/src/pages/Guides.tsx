import { Photo } from '../components/Photo'
import { Eyebrow } from '../components/ui'
import { GUIDES } from '../data/guides'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { NotFoundPage } from './Info'

const TOPICS: { title: string; text: string; slugs: string[] }[] = [
  {
    title: 'Begin hier',
    text: 'Wat heb je nodig, en welk soort systeem past bij je?',
    slugs: ['verbruik-berekenen', 'powerstation-of-vaste-installatie', 'zonnepanelen-op-je-camper', 'lifepo4-of-agm'],
  },
  {
    title: 'Laden en overstappen',
    text: 'Laden tijdens het rijden en lithium in een bestaande camper.',
    slugs: ['dc-dc-lader', 'lithium-op-oude-ebl'],
  },
  {
    title: 'Installeren',
    text: 'Kabels, zekeringen en wanneer je een vakman inschakelt.',
    slugs: ['kabels-en-zekeringen', 'veilig-installeren'],
  },
]

export function GuidesPage() {
  usePageMeta(
    'Gidsen over stroom in je camper',
    'Korte, heldere gidsen over accu’s, zonnepanelen, DC-DC-laders, kabels en veilig installeren in je camper.',
  )
  return (
    <div className="wrap page">
      <header className="page-head">
        <Eyebrow>Gidsen</Eyebrow>
        <h1>Begrijp wat je koopt</h1>
        <p className="lead">Korte gidsen zonder jargon. Elke gids eindigt bij een hulpmiddel om het voor jouw camper uit te rekenen.</p>
      </header>
      {TOPICS.map((t) => (
        <section key={t.title} className="guide-topic" aria-labelledby={`topic-${t.slugs[0]}`}>
          <div className="guide-topic-head">
            <h2 id={`topic-${t.slugs[0]}`}>{t.title}</h2>
            <p className="muted">{t.text}</p>
          </div>
          <div className="card-grid cols-2">
            {t.slugs.map((slug) => {
              const g = GUIDES.find((x) => x.slug === slug)
              if (!g) return null
              return (
                <Link key={g.slug} href={`/gidsen/${g.slug}`} className="card card-link">
                  <span className="card-meta">{g.minutes} min lezen</span>
                  <span className="card-title">{g.title}</span>
                  <span className="card-text">{g.summary}</span>
                  <span className="card-cta">Lees de gids →</span>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export function GuidePage({ slug }: { slug: string }) {
  const idx = GUIDES.findIndex((g) => g.slug === slug)
  const guide = GUIDES[idx]
  usePageMeta(guide?.title ?? 'Gids niet gevonden', guide?.summary ?? '')
  if (!guide) return <NotFoundPage />
  const next = GUIDES[(idx + 1) % GUIDES.length]
  const Body = guide.body

  return (
    <div className="wrap page">
      <article className="article">
        <nav className="crumbs" aria-label="Kruimelpad">
          <Link href="/gidsen">Gidsen</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{guide.title}</span>
        </nav>
        <header className="article-head">
          <p className="card-meta">{guide.minutes} min lezen</p>
          <h1>{guide.title}</h1>
          <p className="lead">{guide.summary}</p>
        </header>
        {guide.image && <Photo image={guide.image} sizes="(min-width: 760px) 720px, 100vw" />}
        <div className="prose">
          <Body />
        </div>
        <aside className="next-box">
          <h2>Reken het uit voor jouw camper</h2>
          <p>Van je verbruik tot de dikte van je kabels: alles op basis van jouw situatie.</p>
          <Link href={guide.cta.href} className="btn btn-primary">
            {guide.cta.label}
          </Link>
        </aside>
        <nav className="article-next" aria-label="Volgende gids">
          <span className="muted small">Volgende gids</span>
          <Link href={`/gidsen/${next.slug}`} className="text-link">
            {next.title} →
          </Link>
        </nav>
      </article>
    </div>
  )
}
