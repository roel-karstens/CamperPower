# CamperPower – openstaande punten

Werklijst voor de website (frontend v2). Afgevinkte punten mogen weg zodra ze live staan.

## Beeld

- [x] **Foto's vervangen door prachtige, inspirerende beelden, vooral de hero.** Hero is `hero-mountains` (gouden weide, crème bus, rustige lucht links), met srcset 800/1600/2400. De rest van de AI-set staat op de home en de methodepagina. Gidsen hebben één rustige Pexels-foto per artikel. Creditregel: “AI-gegenereerd met Grok Bot GenerateImage”, alleen op /beeldverantwoording.
  - Technische details (accu, lader, bedrading) zijn geen AI-beelden.
  - `hero-dunes` en `hero-coast` zitten in de repo als alternatief en staan niet op een pagina.
  - Oude Wikimedia-bestanden zijn verwijderd.
- [x] Geen bronvermelding direct onder de foto's. Die staat alleen nog op de aparte pagina /beeldverantwoording (gelinkt in de footer).
- [ ] Per foto akkoord geven in `docs/design/IMAGE-REGISTRY.md` (kolom "Approved by" staat op Pending).

## Livegang

De site staat live op https://camperpower.vercel.app. Opnieuw publiceren: `cd frontend && npx vercel deploy --prod`.

- [ ] Vercel koppelen aan de GitHub-repo, zodat elke push naar `main` automatisch live gaat.
- [ ] Eigen domein camperpower.nl koppelen aan Vercel.
- [ ] Contactadres invullen in `frontend/src/lib/meta.ts` (`SITE.email`). De contactpagina toont nu "komt binnenkort".
- [ ] Pagina's vooraf als HTML laten genereren (prerender/SSG) voor betere vindbaarheid in Google.
- [x] Deelafbeelding (og:image) maken in 1200×630 zodra de nieuwe hero er is. Bestand: `frontend/public/og.jpg`. De meta-URL wijst nu naar `https://camperpower.vercel.app/og.jpg`. Zodra camperpower.nl live is, die absolute URL meeverhuizen.
- [ ] Donkere weergave nog een keer nalopen op een echt telefoonscherm (tokens zijn AA, de hero-scrim ook, maar avondlicht op een OLED is een andere indruk).
- [ ] Fraunces op een Windows-machine zonder variabele-font-ondersteuning controleren. De fallback is Georgia.

## Inhoud en cijfers

- [ ] Prijsbanden in de stuklijst controleren tegen actuele prijzen in Nederlandse webshops.
- [ ] Gidsen laten nalezen door een installateur (vooral veilig installeren en kabels/zekeringen).

## Verdienmodel

- [ ] Affiliateprogramma's kiezen en aanvragen. Pas daarna de pagina "Zo verdienen wij geld" aanpassen.
