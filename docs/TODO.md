# CamperPower – openstaande punten

Werklijst voor de website (frontend v2). Afgevinkte punten mogen weg zodra ze live staan.

## Beeld

- [ ] **Foto's vervangen door prachtige, inspirerende beelden, vooral de hero.** De huidige Wikimedia-foto's zijn functioneel, maar niet sfeervol genoeg. Zoek beelden in de lijn van de referenties (puurwatt.nl, mymoneymile.com): warm licht, camper in een mooi landschap, rust en vrijheid.
  - De hero heeft de hoogste prioriteit: liggend formaat, minimaal 2400 px breed, met rustige ruimte voor de kop.
  - AI-gegenereerd mag. Vermeld dat dan op de pagina Beeldverantwoording, bijvoorbeeld "AI-gegenereerd met [tool]".
  - Laat technische details (accu's, laders, bekabeling) niet door AI verzinnen. Gebruik daarvoor echte foto's of illustraties.
  - Werkwijze: lever 800 en 1600 px aan als WebP in `frontend/public/images/`. Werk `frontend/src/data/images.ts`, `docs/website/IMAGE-CREDITS.md` en `docs/design/IMAGE-REGISTRY.md` bij.
- [x] Geen bronvermelding direct onder de foto's. Die staat alleen nog op de aparte pagina /beeldverantwoording (gelinkt in de footer).
- [ ] Per foto akkoord geven in `docs/design/IMAGE-REGISTRY.md` (kolom "Approved by" staat op Pending).

## Livegang

- [ ] Eigen domein camperpower.nl koppelen aan Vercel.
- [ ] Contactadres invullen in `frontend/src/lib/meta.ts` (`SITE.email`). De contactpagina toont nu "komt binnenkort".
- [ ] Pagina's vooraf als HTML laten genereren (prerender/SSG) voor betere vindbaarheid in Google.
- [ ] Deelafbeelding (og:image) maken in 1200×630 zodra de nieuwe hero er is.

## Inhoud en cijfers

- [ ] Prijsbanden in de stuklijst controleren tegen actuele prijzen in Nederlandse webshops.
- [ ] Gidsen laten nalezen door een installateur (vooral veilig installeren en kabels/zekeringen).

## Verdienmodel

- [ ] Affiliateprogramma's kiezen en aanvragen. Pas daarna de pagina "Zo verdienen wij geld" aanpassen.
