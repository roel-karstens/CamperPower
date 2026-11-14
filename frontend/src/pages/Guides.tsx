import { Photo } from '../components/Photo'
import { Eyebrow } from '../components/ui'
import { useGuides } from '../data/guides'
import type { Locale } from '../i18n/locale'
import { usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'
import { NotFoundPage } from './Info'

const PAGE = {
  nl: {
    metaTitle: 'Gidsen over stroom in je camper',
    meta: 'Korte, heldere gidsen over accu’s, zonnepanelen, DC-DC-laders, kabels en veilig installeren in je camper.',
    eyebrow: 'Gidsen',
    title: 'Begrijp wat je koopt',
    lead: 'Korte gidsen zonder jargon. Elke gids eindigt bij een hulpmiddel om het voor jouw camper uit te rekenen.',
    minutes: (n: number) => `${n} min lezen`,
    read: 'Lees de gids',
    crumbs: 'Kruimelpad',
    nextLabel: 'Volgende gids',
    asideTitle: 'Reken het uit voor jouw camper',
    asideBody: 'Van je verbruik tot de dikte van je kabels: alles op basis van jouw situatie.',
    missingTitle: 'Gids niet gevonden',
    topics: [
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
    ],
  },
  en: {
    metaTitle: 'Guides to camper electrics',
    meta: 'Short, plain guides to batteries, solar, DC-DC chargers, cables and installing a camper system safely.',
    eyebrow: 'Guides',
    title: 'Understand what you are buying',
    lead: 'Short guides, no jargon. Each one ends at a tool that runs the numbers for your camper.',
    minutes: (n: number) => `${n} min read`,
    read: 'Read the guide',
    crumbs: 'Breadcrumb',
    nextLabel: 'Next guide',
    asideTitle: 'Run the numbers for your camper',
    asideBody: 'From daily use to cable thickness, based on how you travel.',
    missingTitle: 'Guide not found',
    topics: [
      {
        title: 'Start here',
        text: 'What you need, and which kind of system fits.',
        slugs: ['verbruik-berekenen', 'powerstation-of-vaste-installatie', 'zonnepanelen-op-je-camper', 'lifepo4-of-agm'],
      },
      {
        title: 'Charging and switching',
        text: 'Charging while you drive, and lithium in a camper you already own.',
        slugs: ['dc-dc-lader', 'lithium-op-oude-ebl'],
      },
      {
        title: 'Installing',
        text: 'Cables, fuses, and when to call an electrician.',
        slugs: ['kabels-en-zekeringen', 'veilig-installeren'],
      },
    ],
  },
} satisfies Record<Locale, unknown>

export function GuidesPage() {
  const { locale } = useRouter()
  const t = PAGE[locale]
  const guides = useGuides()
  usePageMeta(t.metaTitle, t.meta)
  return (
    <div className="wrap page">
      <header className="page-head">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>
      </header>
      {t.topics.map((topic) => (
        <section key={topic.title} className="guide-topic" aria-labelledby={`topic-${topic.slugs[0]}`}>
          <div className="guide-topic-head">
            <h2 id={`topic-${topic.slugs[0]}`}>{topic.title}</h2>
            <p className="muted">{topic.text}</p>
          </div>
          <div className="card-grid cols-2">
            {topic.slugs.map((slug) => {
              const g = guides.find((x) => x.slug === slug)
              if (!g) return null
              return (
                <Link key={g.slug} href={`/gidsen/${g.slug}`} className="card card-link guide-card">
                  {g.image && (
                    <Photo image={g.image} sizes="(min-width: 960px) 40vw, 100vw" className="guide-card-photo" />
                  )}
                  <span className="card-meta">{t.minutes(g.minutes)}</span>
                  <span className="card-title">{g.title}</span>
                  <span className="card-text">{g.summary}</span>
                  <span className="card-cta">{t.read} →</span>
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
  const { locale } = useRouter()
  const t = PAGE[locale]
  const guides = useGuides()
  const idx = guides.findIndex((g) => g.slug === slug)
  const guide = guides[idx]
  usePageMeta(guide?.title ?? t.missingTitle, guide?.summary ?? '')
  if (!guide) return <NotFoundPage />
  const next = guides[(idx + 1) % guides.length]
  const Body = guide.body

  return (
    <div className="wrap page">
      <article className="article">
        <nav className="crumbs" aria-label={t.crumbs}>
          <Link href="/gidsen">{t.eyebrow}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{guide.title}</span>
        </nav>
        {guide.image && (
          <Photo image={guide.image} sizes="(min-width: 760px) 720px, 100vw" className="guide-header-photo" />
        )}
        <header className="article-head">
          <p className="card-meta">{t.minutes(guide.minutes)}</p>
          <h1>{guide.title}</h1>
          <p className="lead">{guide.summary}</p>
        </header>
        <div className="prose">
          <Body />
        </div>
        <aside className="next-box">
          <h2>{t.asideTitle}</h2>
          <p>{t.asideBody}</p>
          <Link href={guide.cta.href} className="btn btn-primary">
            {guide.cta.label}
          </Link>
        </aside>
        <nav className="article-next" aria-label={t.nextLabel}>
          <span className="muted small">{t.nextLabel}</span>
          <Link href={`/gidsen/${next.slug}`} className="text-link">
            {next.title} →
          </Link>
        </nav>
      </article>
    </div>
  )
}
