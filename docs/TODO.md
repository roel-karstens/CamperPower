# CamperPower – openstaande punten

Werklijst voor de website (frontend v2). Afgevinkte punten mogen weg zodra ze live staan.

## Beeld

- [x] **Foto's vervangen door prachtige, inspirerende beelden, vooral de hero.** Hero is `hero-mountains` (gouden weide, crème bus, rustige lucht links), met srcset 800/1600/2400. De rest van de AI-set staat op de home en de methodepagina. Gidsen hebben één rustige Pexels-foto per artikel. Creditregel: “AI-gegenereerd met Grok Bot GenerateImage”, alleen op /beeldverantwoording.
  - Technische details (accu, lader, bedrading) zijn geen AI-beelden.
  - `hero-dunes` en `hero-coast` zitten in de repo als alternatief en staan niet op een pagina.
  - Oude Wikimedia-bestanden zijn verwijderd.
- [x] Geen bronvermelding direct onder de foto's. Die staat alleen nog op de aparte pagina /beeldverantwoording (gelinkt in de footer).
- [ ] Per foto akkoord geven in `docs/design/IMAGE-REGISTRY.md` (kolom "Approved by" staat op Pending).

## Uiterlijk

- [x] UI-overhaul gemerged en live (PR #1, warm outdoor-uiterlijk).

## Livegang

De site staat live op https://camperpower.vercel.app. Elke merge naar `main` gaat automatisch naar productie. Vercel-project: root directory `frontend`.

- [x] Vercel aan GitHub koppelen. Klaar: root directory is `frontend`, een merge naar `main` publiceert productie.
- [ ] Eigen domein camperpower.nl koppelen aan Vercel.
- [ ] Contactadres invullen in `frontend/src/lib/meta.ts` (`SITE.email`). De contactpagina toont nu "komt binnenkort".
- [ ] Pagina's vooraf als HTML laten genereren (prerender/SSG) voor betere vindbaarheid in Google. Tot die tijd zet JavaScript `lang`, hreflang en de titel.
- [x] Deelafbeelding (og:image) maken in 1200×630 zodra de nieuwe hero er is. Bestand: `frontend/public/og.jpg`. De meta-URL wijst nu naar `https://camperpower.vercel.app/og.jpg`. Zodra camperpower.nl live is, die absolute URL meeverhuizen.
- [ ] Donkere weergave nog een keer nalopen op een echt telefoonscherm (tokens zijn AA, de hero-scrim ook, maar avondlicht op een OLED is een andere indruk).
- [ ] Fraunces op een Windows-machine zonder variabele-font-ondersteuning controleren. De fallback is Georgia.

## Inhoud en cijfers

- [ ] Prijsbanden in de stuklijst controleren tegen actuele prijzen in Nederlandse webshops.
- [ ] Gidsen laten nalezen door een installateur (vooral veilig installeren en kabels/zekeringen).

## Verdienmodel

- [ ] Affiliateprogramma's kiezen en aanvragen. Pas daarna de pagina "Zo verdienen wij geld" aanpassen. De links horen in `frontend/src/data/markets.ts`, per markt, niet in de pagina's.

## Internationalisering

Uitbreiding naar Europa. Nederlands blijft de standaard op `/`.

### Fase 1 — Engels (op Europa gericht) op `/en/`

- [x] Engelse routes onder `/en/…`, Nederlands op de huidige paden. Taalschakelaar in de header houdt de huidige pagina (inclusief zoekstring).
- [x] `<html lang>`, hreflang-alternates, `og:locale` en vertaalde titel en beschrijving.
- [x] UI, configurator en gidsen in natuurlijk Engels. Eenheden blijven metrisch (mm², Ah, Wp), prijzen in euro. Hetzelfde ontwerp. URL-slugs blijven voorlopig Nederlands, zodat elke pagina één pad per taal heeft.
- [ ] Affiliate-links en prijsbanden per land/markt. De structuur staat in `frontend/src/data/markets.ts`. Engels toont nu nog de Nederlandse set, en zegt dat erbij. Er zijn nog geen affiliate-URL's.
- [ ] Zonregio-keuze in de configurator (bijvoorbeeld Scandinavië / Centraal-Europa / Zuid-Europa, andere opbrengst per Wp per dag). Nu rekenen we overal met De Bilt (PVGIS). Geen andere cijfers verzinnen.
- [ ] Sitemap per taal. hreflang staat in de HTML; de sitemap wacht op prerender/SSG.
- [ ] Engelse vertaling laten nalezen door een native speaker.

### Fase 2 — Duits op `/de/`

Grootste campermarkt in Europa.

- [ ] Duitse versie op `/de/`.

### Fase 3 — Frans, optioneel

- [ ] Franse versie op `/fr/`, als de eerste twee talen staan.

Noord-Amerika valt voorlopig buiten scope: daar gelden AWG in plaats van mm², NEC/ABYC-normen, een ander productaanbod, en er zijn sterke Engelstalige aanbieders.
