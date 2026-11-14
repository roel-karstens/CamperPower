import { Photo } from '../components/Photo'
import { Eyebrow } from '../components/ui'
import { HERO_ALTERNATIVES, IMAGES } from '../data/images'
import { sourceGroups } from '../data/sources'
import { displayImage } from '../i18n/images'
import {
  AGM_DOD,
  INVERTER_EFFICIENCY,
  LIFEPO4_DOD,
  MAX_DROP,
  NOMINAL_V,
  RHO_COPPER,
} from '../lib/calc'
import { useFormat } from '../lib/format'
import { SITE, usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'
import { monthNames } from '../i18n/months'

function PageHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className="page-head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
    </header>
  )
}

export function MethodEn() {
  const { fmt, num } = useFormat()
  const pct = (v: number) => `${num(Math.round(v * 1000) / 10)}%`
  const months = monthNames('en')
  usePageMeta(
    'How we calculate',
    'The formulas, assumptions and data behind the CamperPower configurator: PVGIS sun data, battery, chargers, inverter, cables and fuses.',
  )
  const annual = NL_IRRADIATION.reduce((s, h, i) => s + h * new Date(2021, i + 1, 0).getDate(), 0)
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Method"
        title="How we calculate"
        lead="Every result from the configurator can be checked. The formulas and assumptions are here. See a mistake? Tell us."
      />
      <Photo image={IMAGES.dyke} sizes="(min-width: 800px) 760px, 100vw" />
      <div className="prose">
        <h2>1. Daily use</h2>
        <p>For each appliance: power times hours per day. Appliances on 230 V are divided by the inverter efficiency.</p>
        <p className="formula">use = Σ (W × hours) + Σ (W × hours ÷ {num(INVERTER_EFFICIENCY)}) for 230 V appliances</p>

        <h2>2. Battery</h2>
        <p>
          We size a LiFePO4 battery at {num(NOMINAL_V)} V and use {pct(LIFEPO4_DOD)} of it. For AGM that is {pct(AGM_DOD)}.
          The battery has to cover your use for the reserve days you choose, and it has to supply the inverter’s peak at
          no more than 1C.
        </p>
        <p className="formula">
          capacity (Ah) = max( use × reserve days ÷ ({num(NOMINAL_V)} × {num(LIFEPO4_DOD)}), inverter (W) ÷ (12 ×{' '}
          {num(INVERTER_EFFICIENCY)}), 100 )
        </p>
        <p>We then round up to the next common size.</p>

        <h2>3. Charging while you drive</h2>
        <p>
          The DC-DC charger is about 20% of the battery capacity (18, 30 or 50 A). The daily yield is charge current ×{' '}
          {num(NOMINAL_V)} V × hours of driving × 0.9.
        </p>

        <h2>4. Solar panels</h2>
        <p>
          We use the average monthly irradiation for De Bilt, in the Netherlands, from PVGIS, and a system efficiency of{' '}
          {pct(PERFORMANCE_RATIO)} for heat, dirt, shade and cable loss. We design for the least sunny month you travel.
          What you gain from shore power and driving is subtracted first.
        </p>
        <p className="formula">
          panel (Wp) = (use × (1 − share of shore power) − driving) ÷ (irradiation × {num(PERFORMANCE_RATIO)})
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <caption>Average irradiation on a horizontal plane, De Bilt, PVGIS-SARAH2, 2013–2020</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">kWh/m² per day</th>
                <th scope="col">Wh per 100 Wp per day</th>
              </tr>
            </thead>
            <tbody>
              {NL_IRRADIATION.map((h, i) => (
                <tr key={i}>
                  <th scope="row">{months.long[i]}</th>
                  <td className="num">{num(h)}</td>
                  <td className="num">{fmt(100 * h * PERFORMANCE_RATIO)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Year</th>
                <td className="num">{fmt(annual)} kWh/m²</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <p>
          Panels tilted towards the south produce more in spring and autumn. On a camper they usually lie flat, so that is
          what we calculate.
        </p>

        <h2>5. Chargers and inverter</h2>
        <ul>
          <li>Solar controller (MPPT): panel power ÷ {num(NOMINAL_V)} V, rounded up to a common size.</li>
          <li>Shore charger: about 15% of the battery capacity.</li>
          <li>Inverter: the largest 230 V appliance × 1.25, plus the smaller 230 V loads that can be on at the same time.</li>
        </ul>

        <h2>6. Cables and fuses</h2>
        <p>
          Every cable has to meet two limits. Voltage drop stays under {pct(MAX_DROP)} of {num(NOMINAL_V)} V, and the cable
          can carry the fuse current. The fuse is 1.25 × the maximum current, rounded up to a standard value.
        </p>
        <p className="formula">
          cross-section (mm²) ≥ 2 × length × current × {num(RHO_COPPER)} ÷ ({num(NOMINAL_V)} × {num(MAX_DROP)})
        </p>

        <h2>7. Prices</h2>
        <p>
          The ranges are a guide for the Dutch market, from budget parts to a known brand, excluding fitting. They are there
          to give you a sense of scale, not a quote. Separate price bands for other countries are not published yet, and we
          have not invented them.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not model shade from a roof vent, an air-conditioning unit or a satellite dish.</li>
          <li>We do not adjust for battery temperature, except in the warnings.</li>
          <li>The result does not replace a check by an electrician.</li>
        </ul>
        <p>
          The sources are on the <Link href="/bronnen">sources</Link> page.
        </p>
      </div>
    </div>
  )
}

export function SourcesEn() {
  usePageMeta('Sources', 'The data and publications CamperPower bases its calculations and guides on.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="References"
        title="Sources"
        lead="Where the numbers and the advice come from. External links open in a new window."
      />
      {sourceGroups('en').map((g) => (
        <section key={g.title} className="source-group">
          <h2>{g.title}</h2>
          <p className="muted">{g.intro}</p>
          <ul className="source-list">
            {g.items.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="source-title">
                  {s.title}
                </a>
                <span className="source-pub">{s.publisher}</span>
                <p>{s.usedFor}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="muted small">
        Photos are listed separately on the <Link href="/beeldverantwoording">image credits</Link> page.
      </p>
    </div>
  )
}

const CREDIT_LABELS = {
  maker: 'Maker',
  license: 'Licence',
  source: 'Source',
  used: 'Used on',
  changes: 'Changes',
}

function CreditList({ images }: { images: typeof HERO_ALTERNATIVES }) {
  return (
    <ul className="credit-list">
      {images.map((raw) => {
        const img = displayImage(raw, 'en')
        return (
          <li key={img.id} className="credit-item">
            <img src={`${img.src}-800.webp`} alt="" width={160} height={Math.round(160 / img.ratio)} loading="lazy" />
            <div>
              <h2>{img.title}</h2>
              <dl>
                <dt>{CREDIT_LABELS.maker}</dt>
                <dd>{img.creator}</dd>
                <dt>{CREDIT_LABELS.license}</dt>
                <dd>
                  {img.licenseUrl ? (
                    <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer">
                      {img.license}
                    </a>
                  ) : (
                    img.license
                  )}
                </dd>
                <dt>{CREDIT_LABELS.source}</dt>
                <dd>
                  {img.sourceUrl ? (
                    <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {img.sourceLabel}
                    </a>
                  ) : (
                    img.sourceLabel
                  )}
                </dd>
                <dt>{CREDIT_LABELS.used}</dt>
                <dd>{img.usedOn}</dd>
                <dt>{CREDIT_LABELS.changes}</dt>
                <dd>{img.changes}</dd>
              </dl>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function CreditsEn() {
  usePageMeta('Image credits', 'Where the photos on CamperPower come from, and under which licence.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="References"
        title="Image credits"
        lead="The atmosphere photos were generated with Grok Bot GenerateImage. The guides use free stock photos from Pexels. We do not invent technical details."
      />
      <CreditList images={Object.values(IMAGES)} />
      <h2>Alternative heroes, not placed</h2>
      <p className="muted">These two images are in the set and in the source, but they are not on a page.</p>
      <CreditList images={HERO_ALTERNATIVES} />
    </div>
  )
}

export function PrivacyEn() {
  usePageMeta('Privacy', 'CamperPower uses no cookies and no tracking. Your calculation stays on your own device.')
  return (
    <div className="wrap page narrow">
      <PageHead eyebrow="Privacy" title="What we store: almost nothing" lead="No cookies, no tracking, no account." />
      <div className="prose">
        <h2>Your calculation</h2>
        <p>
          What you enter in the configurator is stored in your own browser (localStorage), so you can continue later. It
          does not go to us or to anyone else. The “Start again” button clears it.
        </p>
        <h2>A share link</h2>
        <p>
          If you share a result, your answers are encoded in the link itself. Anyone with the link can see them. There is
          no name, address or other personal data in it.
        </p>
        <h2>Statistics and cookies</h2>
        <p>We use no analytics, no advertising networks and no cookies.</p>
        <h2>Hosting</h2>
        <p>
          As with any website, the server that hosts the site sees your IP address and which page you request. We do not
          use that data.
        </p>
        <h2>External links</h2>
        <p>If you follow a link to another website, that site’s privacy policy applies.</p>
      </div>
    </div>
  )
}

export function MoneyEn() {
  usePageMeta('How we make money', 'How CamperPower stays independent, and how it may earn money later.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Transparency"
        title="How we make money"
        lead="Right now: we don’t. The site is free and has no advertising."
      />
      <div className="prose">
        <h2>Now</h2>
        <p>
          There are no affiliate links, advertisements or sponsored articles on this site. No manufacturer or shop pays us.
        </p>
        <h2>Later</h2>
        <p>
          We may link to shops where you can buy the parts. If you buy through such a link, we receive a small percentage.
          You do not pay more. Links can differ by country. Until a programme is in place, every market list is empty.
        </p>
        <h2>Our rules</h2>
        <ul>
          <li>An affiliate link is always recognisable as an affiliate link.</li>
          <li>An affiliate link appears at most once on a page, and never next to a warning.</li>
          <li>The calculation decides the advice, never the commission.</li>
          <li>We also name products we earn nothing on, when they fit better.</li>
        </ul>
      </div>
    </div>
  )
}

export function ContactEn() {
  usePageMeta('Contact', 'Contact CamperPower about questions, mistakes or additions.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Contact"
        title="Contact"
        lead="Found a mistake, or have a question or an idea? We want to hear it. Every correction makes the calculation better."
      />
      <div className="prose">
        {SITE.email ? (
          <p>
            Email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        ) : (
          <p>A fixed email address is coming. Until then this page has no contact details.</p>
        )}
        <h2>Advice for your camper?</h2>
        <p>
          We do not give personal installation advice. Always have the installation checked by a camper electrician. Take
          the result from the <Link href="/configurator">configurator</Link> with you, so it is clear what you want.
        </p>
      </div>
    </div>
  )
}

export function NotFoundEn() {
  usePageMeta('Page not found', 'This page does not exist.')
  return (
    <div className="wrap page narrow">
      <PageHead eyebrow="404" title="This page does not exist" lead="The link may be out of date. You can continue here:" />
      <ul className="link-list">
        <li>
          <Link href="/">To the homepage</Link>
        </li>
        <li>
          <Link href="/configurator">Size your system</Link>
        </li>
        <li>
          <Link href="/gidsen">All guides</Link>
        </li>
      </ul>
    </div>
  )
}
