import type { ReactNode } from 'react'
import { Link } from '../lib/router'
import { fmt } from '../lib/format'
import { MONTHS_LONG, NL_IRRADIATION, PERFORMANCE_RATIO } from '../lib/solar'
import { CABLE_TABLE } from '../lib/calc'
import { IMAGES, type ImageCredit } from './images'

export interface Guide {
  slug: string
  title: string
  summary: string
  minutes: number
  image?: ImageCredit
  cta: { href: string; label: string }
  body: () => ReactNode
}

export const GUIDES: Guide[] = [
  {
    slug: 'verbruik-berekenen',
    title: 'Je dagverbruik berekenen',
    summary: 'Alles begint bij watt × uur. Zo schat je het goed in, en hier zitten de valkuilen.',
    minutes: 4,
    image: IMAGES.guideUse,
    cta: { href: '/configurator', label: 'Bereken je verbruik' },
    body: () => (
      <>
        <p>
          Elke berekening van accu of zonnepaneel begint bij één getal: hoeveel energie gebruik je per dag? Dat druk je uit
          in wattuur (Wh). Een apparaat van 40 watt dat 12 uur aan staat, gebruikt 480 Wh.
        </p>
        <h2>De formule</h2>
        <p className="formula">verbruik (Wh) = vermogen (W) × uren per dag</p>
        <p>
          Tel dat op voor alle apparaten en je hebt je dagverbruik. Een stel met koelkast, verlichting, telefoons, waterpomp
          en een laptop komt meestal op 600 tot 900 Wh.
        </p>
        <h2>Drie valkuilen</h2>
        <h3>1. De koelkast draait niet continu</h3>
        <p>
          Een compressorkoelkast trekt 40 tot 60 W als hij draait, maar slaat steeds af. Gemiddeld is dat 30 tot 50% van de
          tijd, in de zomer meer. Reken daarom met ongeveer 12 uur per dag, niet met 24.
        </p>
        <h3>2. 230 volt kost extra</h3>
        <p>
          Alles wat via het stopcontact gaat, loopt door een omvormer. Die verliest ongeveer 10 tot 15%. Een laptop van
          60 W op 230 V kost je accu dus zo’n 68 W. Laad je laptop met een 12V-lader, dan scheelt dat.
        </p>
        <h3>3. Kort maar fors telt ook</h3>
        <p>
          Een koffiezetapparaat van 1000 W gebruikt in 9 minuten 150 Wh. Dat is weinig energie, maar het vermogen bepaalt
          wel hoe groot je omvormer en kabels moeten zijn.
        </p>
        <h2>Meten is weten</h2>
        <p>
          Heb je al een systeem? Een accumonitor met shunt laat precies zien wat je per dag gebruikt. Meet een paar normale
          dagen en gebruik dat getal in de configurator.
        </p>
      </>
    ),
  },
  {
    slug: 'zonnepanelen-op-je-camper',
    title: 'Hoeveel zonnepaneel heb je nodig?',
    summary: 'De opbrengst verschilt per maand een factor tien. Zo reken je met de juiste maand.',
    minutes: 5,
    image: IMAGES.guideSolar,
    cta: { href: '/configurator', label: 'Bereken je zonnepanelen' },
    body: () => (
      <>
        <p>
          Je leest vaak dat 100 Wp ongeveer 400 Wh per dag oplevert. In de zomer klopt dat ongeveer. In maart en oktober
          krijg je de helft, in december een tiende.
        </p>
        <h2>Opbrengst per 100 Wp, plat op het dak</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Maand</th>
                <th scope="col">Instraling (kWh/m² per dag)</th>
                <th scope="col">Opbrengst per 100 Wp</th>
              </tr>
            </thead>
            <tbody>
              {NL_IRRADIATION.map((h, i) => (
                <tr key={i}>
                  <th scope="row">{MONTHS_LONG[i]}</th>
                  <td className="num">{h.toLocaleString('nl-NL')}</td>
                  <td className="num">{fmt(100 * h * PERFORMANCE_RATIO)} Wh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          Instraling: PVGIS, De Bilt, gemiddelde 2013–2020. Opbrengst inclusief {fmt(PERFORMANCE_RATIO * 100)}%
          systeemrendement voor warmte, vuil, schaduw en kabels.
        </p>
        <h2>Ontwerp op je donkerste reismaand</h2>
        <p>
          Reis je van april tot september? Dan bepaalt september hoeveel paneel je nodig hebt, niet juli. In de zomer heb je
          dan een overschot, en dat is prima.
        </p>
        <p className="formula">paneel (Wp) = dagverbruik ÷ (instraling × {PERFORMANCE_RATIO.toLocaleString('nl-NL')})</p>
        <h2>Past het op je dak?</h2>
        <p>
          Een paneel van 100 Wp is ongeveer 1 × 0,55 m. Op een buscamper past meestal 200 tot 300 Wp, op een halfintegraal
          400 tot 600 Wp. Kom je tekort? Dan vangt de DC-DC-lader het op tijdens het rijden.
        </p>
        <h2>Star of flexibel?</h2>
        <p>
          Starre panelen op een frame blijven koeler, leveren daardoor meer en gaan langer mee. Flexibele panelen zijn licht
          en onopvallend, maar worden heet als ze direct op het dak zijn gelijmd.
        </p>
      </>
    ),
  },
  {
    slug: 'lifepo4-of-agm',
    title: 'LiFePO4 of AGM?',
    summary: 'Waarom bijna iedereen naar lithium overstapt, en wanneer AGM nog volstaat.',
    minutes: 4,
    image: IMAGES.guideBattery,
    cta: { href: '/lithium-check', label: 'Doe de lithium-check' },
    body: () => (
      <>
        <p>
          De meeste campers van vóór 2020 hebben een AGM- of gelaccu. Steeds meer camperaars vervangen die door
          lithium-ijzerfosfaat: LiFePO4. Dat is de veilige lithiumsoort, niet dezelfde als in je telefoon.
        </p>
        <h2>Het verschil in één tabel</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">AGM, 100 Ah</th>
                <th scope="col">LiFePO4, 100 Ah</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">Bruikbaar</th><td>ca. 50 Ah</td><td>ca. 90 Ah</td></tr>
              <tr><th scope="row">Gewicht</th><td>ca. 28 kg</td><td>ca. 12 kg</td></tr>
              <tr><th scope="row">Laadcycli</th><td>300–600</td><td>2.000–6.000</td></tr>
              <tr><th scope="row">Spanning onder belasting</th><td>zakt geleidelijk</td><td>blijft stabiel</td></tr>
              <tr><th scope="row">Laden onder 0 °C</th><td>kan</td><td>niet zonder verwarming</td></tr>
            </tbody>
          </table>
        </div>
        <p className="muted small">Typische waarden. Kijk altijd naar het datablad van de specifieke accu.</p>
        <h2>Wanneer is AGM nog prima?</h2>
        <p>
          Sta je vooral op campings met walstroom en gebruik je weinig? Dan is een goede AGM-accu goedkoper en hoef je niets
          aan je laders te veranderen.
        </p>
        <h2>Let op bij de overstap</h2>
        <ul>
          <li>Combineer nooit lithium met een loodaccu in hetzelfde accupakket.</li>
          <li>Je laders moeten een LiFePO4-profiel hebben. Oude EBL’s hebben dat vaak niet.</li>
          <li>Lithium laadt zo snel dat de dynamo overbelast kan raken. Een DC-DC-lader begrenst dat.</li>
        </ul>
        <p>
          Lees verder over <Link href="/gidsen/lithium-op-oude-ebl">lithium op een oude EBL</Link> en over de{' '}
          <Link href="/gidsen/dc-dc-lader">DC-DC-lader</Link>.
        </p>
      </>
    ),
  },
  {
    slug: 'dc-dc-lader',
    title: 'DC-DC-lader: laden tijdens het rijden',
    summary: 'Waarom lithium niet direct aan de dynamo mag, en wat een slimme dynamo verandert.',
    minutes: 4,
    image: IMAGES.guideDrive,
    cta: { href: '/configurator', label: 'Bereken je laders' },
    body: () => (
      <>
        <p>
          Vroeger zat de woonaccu via een scheidingsrelais aan de dynamo. Met lithium werkt dat niet goed meer. Een DC-DC-lader
          zit daarom tussen de startaccu en de woonaccu en laadt met het juiste profiel.
        </p>
        <h2>Drie redenen voor een DC-DC-lader</h2>
        <ol>
          <li>
            <strong>Lithium trekt te veel stroom.</strong> Een lege LiFePO4-accu neemt alles wat de dynamo levert. De dynamo
            wordt heet en gaat eerder stuk.
          </li>
          <li>
            <strong>De spanning is te laag.</strong> Over een lange kabel zakt de spanning. Lithium raakt dan nooit vol.
          </li>
          <li>
            <strong>Slimme dynamo’s.</strong> Bij Euro 6, meestal vanaf 2015, verlaagt de motor de dynamospanning tijdens het
            rijden. Een gewoon relais laadt dan bijna niets.
          </li>
        </ol>
        <h2>Hoe groot?</h2>
        <p>
          Een vuistregel: ongeveer 20 tot 30% van je accucapaciteit. Voor 100 tot 150 Ah is 30 A genoeg, vanaf 200 Ah kies je
          50 A. Meer dan 50 A vraagt de meeste dynamo’s te veel.
        </p>
        <h2>Bij een slimme dynamo</h2>
        <p>
          Kies een lader die schakelt op het motorsignaal (D+ of ignition) in plaats van alleen op spanning. Anders schakelt
          hij uit zodra de dynamospanning zakt.
        </p>
        <h2>Kabels</h2>
        <p>
          De kabel van startaccu naar DC-DC-lader is vaak 4 tot 6 meter. Met 30 A heb je dan al 16 tot 25 mm² nodig om de
          spanningsval onder 3% te houden. De <Link href="/configurator">configurator</Link> rekent het voor je uit.
        </p>
      </>
    ),
  },
  {
    slug: 'lithium-op-oude-ebl',
    title: 'Lithium op een oude EBL',
    summary: 'Schaudt, Nordelettronica, CBE: wat je moet weten voor je een lithiumaccu aansluit.',
    minutes: 5,
    image: IMAGES.guideOld,
    cta: { href: '/lithium-check', label: 'Doe de lithium-check' },
    body: () => (
      <>
        <p>
          In veel campers zit een elektroblok (EBL). Dat is lader, zekeringkast en scheidingsrelais in één. Het werkt goed met
          de loodaccu waarvoor het is ontworpen. Met lithium wordt het lastiger.
        </p>
        <h2>Het probleem</h2>
        <p>
          Een loodaccu laad je tot ongeveer 14,4 V en houdt je daarna op 13,8 V (druppelladen). LiFePO4 wil tot 14,2 à 14,4 V,
          maar daarna geen druppellading. Oudere EBL’s hebben vaak geen lithiumstand. De accu raakt dan niet vol, of staat
          wekenlang onder spanning.
        </p>
        <h2>Wat kun je doen?</h2>
        <ol>
          <li>
            <strong>Zoek het type op.</strong> Op de sticker van het EBL staat het type. Kijk in de handleiding of op de site
            van de fabrikant of er een lithiumstand of update bestaat.
          </li>
          <li>
            <strong>Zet de lader uit en voeg een losse lader toe.</strong> Veel camperaars laten het EBL voor de zekeringen en
            schakelen de interne lader uit. Een losse lader met LiFePO4-profiel neemt het over.
          </li>
          <li>
            <strong>Vervang de dynamolading.</strong> Het scheidingsrelais in het EBL vervang je door een DC-DC-lader.
          </li>
        </ol>
        <h2>Let op</h2>
        <p>
          Sommige EBL’s gebruiken de accuspanning om te bepalen of de motor draait. Met lithium, dat een hogere rustspanning
          heeft, gaat dat soms mis. Twijfel je? Vraag het na bij de fabrikant of een camperelektricien.
        </p>
      </>
    ),
  },
  {
    slug: 'kabels-en-zekeringen',
    title: 'Kabels en zekeringen',
    summary: 'Te dunne kabels worden heet en kosten energie. Zo kies je de juiste doorsnede.',
    minutes: 5,
    image: IMAGES.guideCable,
    cta: { href: '/configurator', label: 'Bereken je kabels' },
    body: () => (
      <>
        <p>
          Bij 12 volt lopen er grote stromen. Een omvormer van 2000 W trekt bijna 200 A. Elke kabel moet twee dingen aankunnen:
          de stroom zonder heet te worden, en de afstand zonder te veel spanning te verliezen.
        </p>
        <h2>1. Spanningsval</h2>
        <p>Houd de spanningsval onder 3%. Bij 12,8 V is dat ongeveer 0,38 V.</p>
        <p className="formula">doorsnede (mm²) = 2 × lengte (m) × stroom (A) × 0,0175 ÷ toegestane spanningsval (V)</p>
        <p>
          De factor 2 is omdat de stroom heen én terug gaat. Voorbeeld: 30 A over 5 meter vraagt 2 × 5 × 30 × 0,0175 ÷ 0,38 =
          13,8 mm². Je kiest dan 16 mm².
        </p>
        <h2>2. Stroomcapaciteit</h2>
        <p>Daarnaast mag de kabel niet te warm worden. Wij rekenen voorzichtig met deze waarden:</p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Doorsnede</th>
                <th scope="col">Maximaal continu</th>
              </tr>
            </thead>
            <tbody>
              {CABLE_TABLE.map((c) => (
                <tr key={c.mm2}>
                  <th scope="row">{c.mm2.toLocaleString('nl-NL')} mm²</th>
                  <td className="num">{c.amps} A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          Flexibel, vertind koper met 105 °C-isolatie, vrij liggend. In een kabelgoot of bundel ligt de grens lager.
        </p>
        <h2>3. De zekering past bij de kabel</h2>
        <p>
          Een zekering beschermt de kabel, niet het apparaat. Kies hem ongeveer 1,25 keer de maximale stroom, en nooit hoger
          dan wat de kabel aankan. Plaats hem zo dicht mogelijk bij de accu: liefst binnen 20 cm.
        </p>
      </>
    ),
  },
  {
    slug: 'veilig-installeren',
    title: 'Veilig installeren',
    summary: 'De vijf regels die brand voorkomen, en wanneer je het aan een vakman overlaat.',
    minutes: 4,
    image: IMAGES.guideInstall,
    cta: { href: '/configurator', label: 'Bereken je systeem' },
    body: () => (
      <>
        <p>
          Een 12V-installatie voelt ongevaarlijk: je krijgt er geen schok van. Maar een lithiumaccu kan in een fractie van een
          seconde duizenden ampères leveren. Een losse verbinding of een kortsluiting wordt dan gloeiend heet.
        </p>
        <h2>Vijf regels</h2>
        <ol>
          <li>
            <strong>Elke pluskabel krijgt een zekering</strong>, zo dicht mogelijk bij de accu.
          </li>
          <li>
            <strong>Een hoofdschakelaar</strong> waarmee je alles in één keer losmaakt.
          </li>
          <li>
            <strong>Geperste kabelschoenen</strong> met de juiste tang. Niet solderen, niet klemmen.
          </li>
          <li>
            <strong>Vastzetten.</strong> Accu’s en kabels mogen niet kunnen schuiven tijdens het rijden of een noodstop.
          </li>
          <li>
            <strong>Juiste aanhaalmoment</strong> op accupolen en busbars. Te los wordt heet, te vast breekt de pool.
          </li>
        </ol>
        <h2>Wanneer schakel je een vakman in?</h2>
        <ul>
          <li>Bij een omvormer vanaf ongeveer 2000 W, of stromen boven 150 A.</li>
          <li>Als je de 230V-walstroomkant aanpast. Daar gelden andere regels en is een aardlekschakelaar nodig.</li>
          <li>Als je twijfelt over je EBL of de bedrading van de fabrikant.</li>
        </ul>
        <p>
          Bouw je zelf? Laat het eindresultaat controleren voor je de hoofdschakelaar omzet. Veel camperelektriciens doen
          dat tegen een vast tarief.
        </p>
      </>
    ),
  },
  {
    slug: 'powerstation-of-vaste-installatie',
    title: 'Powerstation of vaste installatie?',
    summary: 'Een powerstation is makkelijk. Een vaste installatie laadt beter onderweg. Zo kies je.',
    minutes: 4,
    image: IMAGES.guidePower,
    cta: { href: '/powerstation-of-vast', label: 'Doe de keuzehulp' },
    body: () => (
      <>
        <p>
          Een powerstation is een draagbare accu met laders en stopcontacten in één kast. Een vaste installatie bestaat uit
          losse onderdelen die vast in je camper zitten.
        </p>
        <h2>Powerstation: goed als…</h2>
        <ul>
          <li>je weinig gebruikt, tot ongeveer 500 Wh per dag;</li>
          <li>je niets aan je camper wilt veranderen, of hem huurt of leaset;</li>
          <li>je de accu ook thuis of in een andere auto wilt gebruiken.</li>
        </ul>
        <h2>Vaste installatie: beter als…</h2>
        <ul>
          <li>je meerdere dagen vrij staat;</li>
          <li>je tijdens het rijden goed wilt laden. Via de sigarettenaansteker gaat dat maar met 8 tot 10 A;</li>
          <li>je meer dan een paar honderd watt zonnepaneel op het dak wilt;</li>
          <li>je bestaande 12V-apparaten op één systeem wilt aansluiten.</li>
        </ul>
        <h2>Een tussenvorm</h2>
        <p>
          Sommige powerstations kun je vast inbouwen, met een eigen DC-DC-lader en een dakpaneel. Dat combineert gemak met
          beter laden, maar is vaak duurder dan losse onderdelen.
        </p>
      </>
    ),
  },
]
