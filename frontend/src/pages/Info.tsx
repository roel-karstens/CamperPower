import { Photo } from '../components/Photo'
import { Eyebrow } from '../components/ui'
import { HERO_ALTERNATIVES, IMAGES } from '../data/images'
import { SOURCE_GROUPS } from '../data/sources'
import { useRouter } from '../lib/useRouter'
import { ContactEn, CreditsEn, MethodEn, MoneyEn, NotFoundEn, PrivacyEn, SourcesEn } from './infoEn'
import {
  AGM_DOD,
  INVERTER_EFFICIENCY,
  LIFEPO4_DOD,
  MAX_DROP,
  NOMINAL_V,
  RHO_COPPER,
} from '../lib/calc'
import { fmt } from '../lib/format'
import { SITE, usePageMeta } from '../lib/meta'
import { Link } from '../lib/router'
import { MONTHS_LONG, NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'

const nl = (v: number) => v.toLocaleString('nl-NL')
const pct = (v: number) => `${nl(Math.round(v * 1000) / 10)}%`

function PageHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className="page-head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
    </header>
  )
}

export function MethodPage() {
  const { locale } = useRouter()
  return locale === 'en' ? <MethodEn /> : <MethodNl />
}

function MethodNl() {
  usePageMeta(
    'Zo rekenen wij',
    'Alle formules, aannames en data achter de CamperPower-configurator: zondata uit PVGIS, accu, laders, omvormer, kabels en zekeringen.',
  )
  const annual = NL_IRRADIATION.reduce((s, h, i) => s + h * new Date(2021, i + 1, 0).getDate(), 0)
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Methode"
        title="Zo rekenen wij"
        lead="Elke uitkomst van de configurator is na te rekenen. Hier staan alle formules en aannames. Zie je een fout? Laat het ons weten."
      />
      <Photo image={IMAGES.dyke} sizes="(min-width: 800px) 760px, 100vw" />
      <div className="prose">
        <h2>1. Dagverbruik</h2>
        <p>Per apparaat: vermogen × uren per dag. Apparaten op 230 V delen we door het rendement van de omvormer.</p>
        <p className="formula">verbruik = Σ (W × uur) + Σ (W × uur ÷ {nl(INVERTER_EFFICIENCY)}) voor 230V-apparaten</p>

        <h2>2. Accu</h2>
        <p>
          We rekenen met LiFePO4 op {nl(NOMINAL_V)} V, waarvan we {pct(LIFEPO4_DOD)} gebruiken. Bij AGM is dat{' '}
          {pct(AGM_DOD)}. De accu moet je verbruik dekken voor het aantal reservedagen dat je kiest, en de piekstroom van de
          omvormer kunnen leveren bij maximaal 1C.
        </p>
        <p className="formula">
          capaciteit (Ah) = max( verbruik × reservedagen ÷ ({nl(NOMINAL_V)} × {nl(LIFEPO4_DOD)}), omvormer (W) ÷ (12 ×{' '}
          {nl(INVERTER_EFFICIENCY)}), 100 )
        </p>
        <p>Daarna ronden we af naar de eerstvolgende gangbare maat.</p>

        <h2>3. Laden tijdens het rijden</h2>
        <p>
          De DC-DC-lader is ongeveer 20% van de accucapaciteit (18, 30 of 50 A). De opbrengst per dag is laadstroom × {nl(NOMINAL_V)} V
          × rijuren × 0,9.
        </p>

        <h2>4. Zonnepanelen</h2>
        <p>
          We gebruiken de gemiddelde instraling per maand voor De Bilt uit PVGIS en een systeemrendement van{' '}
          {pct(PERFORMANCE_RATIO)} voor warmte, vuil, schaduw en kabelverlies. We rekenen op de minst zonnige maand waarin je
          reist. Wat je met walstroom en rijden laadt, trekken we eerst af.
        </p>
        <p className="formula">
          paneel (Wp) = (verbruik × (1 − aandeel walstroom) − rijden) ÷ (instraling × {nl(PERFORMANCE_RATIO)})
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <caption>Gemiddelde instraling op een horizontaal vlak, De Bilt, PVGIS-SARAH2, 2013–2020</caption>
            <thead>
              <tr>
                <th scope="col">Maand</th>
                <th scope="col">kWh/m² per dag</th>
                <th scope="col">Wh per 100 Wp per dag</th>
              </tr>
            </thead>
            <tbody>
              {NL_IRRADIATION.map((h, i) => (
                <tr key={i}>
                  <th scope="row">{MONTHS_LONG[i]}</th>
                  <td className="num">{nl(h)}</td>
                  <td className="num">{fmt(100 * h * PERFORMANCE_RATIO)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Jaar</th>
                <td className="num">{fmt(annual)} kWh/m²</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <p>
          Panelen onder een hoek naar het zuiden leveren in voor- en najaar meer. Op een camper liggen ze meestal plat, dus
          dat rekenen we.
        </p>

        <h2>5. Laders en omvormer</h2>
        <ul>
          <li>Zonnelaadregelaar (MPPT): paneelvermogen ÷ {nl(NOMINAL_V)} V, naar boven afgerond op een gangbare maat.</li>
          <li>Walstroomlader: ongeveer 15% van de accucapaciteit.</li>
          <li>
            Omvormer: het grootste 230V-apparaat × 1,25, plus de kleinere 230V-apparaten die tegelijk aan kunnen staan.
          </li>
        </ul>

        <h2>6. Kabels en zekeringen</h2>
        <p>
          Elke kabel moet aan twee eisen voldoen. De spanningsval blijft onder {pct(MAX_DROP)} van {nl(NOMINAL_V)} V, en de
          kabel kan de stroom van de zekering aan. De zekering is 1,25 × de maximale stroom, naar boven afgerond op een
          standaardwaarde.
        </p>
        <p className="formula">
          doorsnede (mm²) ≥ 2 × lengte × stroom × {nl(RHO_COPPER)} ÷ ({nl(NOMINAL_V)} × {nl(MAX_DROP)})
        </p>

        <h2>7. Prijzen</h2>
        <p>
          De prijsranges zijn indicaties voor de Nederlandse markt, van budget tot A-merk, exclusief montage. Ze zijn bedoeld om
          je een idee te geven, niet als offerte.
        </p>

        <h2>Wat we niet doen</h2>
        <ul>
          <li>We rekenen niet met schaduw van een dakraam, airco of satellietschotel.</li>
          <li>We houden geen rekening met de temperatuur van de accu, behalve in de waarschuwingen.</li>
          <li>De uitkomst vervangt geen controle door een vakman.</li>
        </ul>
        <p>
          Alle bronnen staan op de pagina <Link href="/bronnen">bronnen</Link>.
        </p>
      </div>
    </div>
  )
}

export function SourcesPage() {
  const { locale } = useRouter()
  return locale === 'en' ? <SourcesEn /> : <SourcesNl />
}

function SourcesNl() {
  usePageMeta('Bronnen', 'De data en publicaties waarop CamperPower zijn berekeningen en gidsen baseert.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Verantwoording"
        title="Bronnen"
        lead="Waar onze getallen en adviezen vandaan komen. Externe links openen in een nieuw venster."
      />
      {SOURCE_GROUPS.map((g) => (
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
        Foto’s staan apart op de pagina <Link href="/beeldverantwoording">beeldverantwoording</Link>.
      </p>
    </div>
  )
}

function CreditList({ images }: { images: typeof HERO_ALTERNATIVES }) {
  return (
    <ul className="credit-list">
      {images.map((img) => (
        <li key={img.id} className="credit-item">
          <img src={`${img.src}-800.webp`} alt="" width={160} height={Math.round(160 / img.ratio)} loading="lazy" />
          <div>
            <h2>{img.title}</h2>
            <dl>
              <dt>Maker</dt>
              <dd>{img.creator}</dd>
              <dt>Licentie</dt>
              <dd>
                {img.licenseUrl ? (
                  <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {img.license}
                  </a>
                ) : (
                  img.license
                )}
              </dd>
              <dt>Bron</dt>
              <dd>
                {img.sourceUrl ? (
                  <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {img.sourceLabel}
                  </a>
                ) : (
                  img.sourceLabel
                )}
              </dd>
              <dt>Gebruikt op</dt>
              <dd>{img.usedOn}</dd>
              <dt>Wijzigingen</dt>
              <dd>{img.changes}</dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ImageCreditsPage() {
  const { locale } = useRouter()
  return locale === 'en' ? <CreditsEn /> : <CreditsNl />
}

function CreditsNl() {
  usePageMeta('Beeldverantwoording', 'Herkomst en licenties van de foto’s op CamperPower.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Verantwoording"
        title="Beeldverantwoording"
        lead="Sfeerbeelden zijn AI-gegenereerd met Grok Bot GenerateImage. De gidsen gebruiken vrije stockfoto’s van Pexels. Technische details verzinnen we niet."
      />
      <CreditList images={Object.values(IMAGES)} />
      <h2>Alternatieve hero’s, niet geplaatst</h2>
      <p className="muted">Deze twee beelden zitten in de set en in de broncode, maar staan niet op een pagina.</p>
      <CreditList images={HERO_ALTERNATIVES} />
      <p className="muted small" lang="en">
        Atmosphere photos are labelled “AI-gegenereerd met Grok Bot GenerateImage”. Guide photos are from Pexels under the
        Pexels License. Credits are listed here, not under the pictures.
      </p>
    </div>
  )
}

export function PrivacyPage() {
  const { locale } = useRouter()
  return locale === 'en' ? <PrivacyEn /> : <PrivacyNl />
}

function PrivacyNl() {
  usePageMeta('Privacy', 'CamperPower gebruikt geen cookies en geen tracking. Je berekening blijft op je eigen apparaat.')
  return (
    <div className="wrap page narrow">
      <PageHead eyebrow="Privacy" title="Wat we bewaren: bijna niets" lead="Geen cookies, geen tracking, geen account." />
      <div className="prose">
        <h2>Je berekening</h2>
        <p>
          Wat je invult in de configurator, bewaren we in de lokale opslag van je eigen browser (localStorage). Zo kun je later
          verder. Het gaat niet naar ons of naar iemand anders. Met de knop ‘Opnieuw beginnen’ wis je het.
        </p>
        <h2>Een deellink</h2>
        <p>
          Deel je je uitkomst, dan staan je antwoorden gecodeerd in de link zelf. Iedereen die de link heeft, kan ze zien. Er
          staat geen naam, adres of andere persoonsgegevens in.
        </p>
        <h2>Statistieken en cookies</h2>
        <p>We gebruiken geen analytics, geen advertentienetwerken en geen cookies.</p>
        <h2>Hosting</h2>
        <p>
          Zoals bij elke website ziet de server waarop de site draait je IP-adres en welke pagina je opvraagt. Wij gebruiken
          die gegevens niet.
        </p>
        <h2>Externe links</h2>
        <p>Klik je op een link naar een andere website, dan geldt daar het privacybeleid van die website.</p>
      </div>
    </div>
  )
}

export function MoneyPage() {
  const { locale } = useRouter()
  return locale === 'en' ? <MoneyEn /> : <MoneyNl />
}

function MoneyNl() {
  usePageMeta('Zo verdienen wij geld', 'Hoe CamperPower onafhankelijk blijft, en hoe we in de toekomst geld willen verdienen.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Transparantie"
        title="Zo verdienen wij geld"
        lead="Op dit moment: niet. De site is gratis en heeft geen advertenties."
      />
      <div className="prose">
        <h2>Nu</h2>
        <p>
          Er staan geen affiliate-links, advertenties of gesponsorde artikelen op deze site. Geen enkele fabrikant of winkel
          betaalt ons.
        </p>
        <h2>Later</h2>
        <p>
          Mogelijk gaan we linken naar winkels waar je onderdelen kunt kopen. Als je via zo’n link iets koopt, krijgen wij
          een klein percentage. Jij betaalt niet meer.
        </p>
        <h2>Onze regels</h2>
        <ul>
          <li>Een affiliate-link is altijd herkenbaar als affiliate-link.</li>
          <li>Een affiliate-link staat hooguit één keer op een pagina, en nooit bij een negatief advies.</li>
          <li>De berekening bepaalt het advies, nooit de vergoeding.</li>
          <li>We noemen ook producten waar we niets aan verdienen, als die beter passen.</li>
        </ul>
      </div>
    </div>
  )
}

export function ContactPage() {
  const { locale } = useRouter()
  return locale === 'en' ? <ContactEn /> : <ContactNl />
}

function ContactNl() {
  usePageMeta('Contact', 'Neem contact op met CamperPower voor vragen, fouten of aanvullingen.')
  return (
    <div className="wrap page narrow">
      <PageHead
        eyebrow="Contact"
        title="Contact"
        lead="Een fout gevonden, een vraag of een idee? We horen het graag. Elke correctie maakt de berekening beter."
      />
      <div className="prose">
        {SITE.email ? (
          <p>
            Mail ons op <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        ) : (
          <p>Er komt binnenkort een vast e-mailadres. Tot die tijd staan op deze pagina nog geen contactgegevens.</p>
        )}
        <h2>Advies voor jouw camper?</h2>
        <p>
          We geven geen persoonlijk installatieadvies. Laat je installatie altijd controleren door een camperelektricien. Neem
          je uitkomst uit de <Link href="/configurator">configurator</Link> mee, dan is direct duidelijk wat je wilt.
        </p>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  const { locale } = useRouter()
  return locale === 'en' ? <NotFoundEn /> : <NotFoundNl />
}

function NotFoundNl() {
  usePageMeta('Pagina niet gevonden', 'Deze pagina bestaat niet (meer).')
  return (
    <div className="wrap page narrow">
      <PageHead eyebrow="404" title="Deze pagina bestaat niet" lead="Misschien is de link verouderd. Hier kun je verder:" />
      <ul className="link-list">
        <li>
          <Link href="/">Naar de homepage</Link>
        </li>
        <li>
          <Link href="/configurator">Bereken je systeem</Link>
        </li>
        <li>
          <Link href="/gidsen">Alle gidsen</Link>
        </li>
      </ul>
    </div>
  )
}
