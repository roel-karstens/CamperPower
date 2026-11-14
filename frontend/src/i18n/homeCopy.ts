import type { Locale } from './locale'

const nl = {
  metaTitle: 'CamperPower',
  meta:
    'Bereken welke accu, zonnepanelen en laders je camper nodig heeft. Onafhankelijk, met Nederlandse zondata, een stuklijst en veiligheidschecks.',
  eyebrow: 'Stroom in je camper',
  h1: 'Weet wat je camper nodig heeft, vóór je iets koopt.',
  lead: 'Bereken welke accu, zonnepanelen en laders passen bij hoe jij reist. Met Nederlandse zondata, een complete stuklijst en de checks die een vakman ook doet.',
  cta: 'Bereken je systeem',
  flat: 'Accu steeds leeg?',
  proof: ['Gratis, zonder account', 'Geen cookies', 'Formules openbaar'],
  startTitle: 'Waar wil je mee beginnen?',
  startLead: 'Iedereen komt met een andere vraag. Kies de jouwe.',
  entries: [
    {
      href: '/accu-leeg',
      q: 'Mijn accu is steeds leeg',
      a: 'Vind in zeven vragen de waarschijnlijke oorzaak, en wat je eraan doet.',
      cta: 'Start de diagnose',
    },
    {
      href: '/powerstation-of-vast',
      q: 'Powerstation of vaste installatie?',
      a: 'Een eerlijke afweging op verbruik, laden onderweg en budget.',
      cta: 'Maak de keuze',
    },
    {
      href: '/configurator',
      q: 'Hoeveel accu en zon heb ik nodig?',
      a: 'Vier stappen. Je krijgt een systeemschema, stuklijst en kabeltabel.',
      cta: 'Bereken je systeem',
    },
    {
      href: '/lithium-check',
      q: 'Kan lithium in mijn oude camper?',
      a: 'Check of je EBL, lader en dynamo geschikt zijn voor LiFePO4.',
      cta: 'Doe de check',
    },
  ],
  exampleEyebrow: 'Voorbeeld',
  exampleTitle: 'Een rondreis van mei tot september',
  exampleBefore: 'Een stel, koelkast, laptop en dakventilator. Samen ',
  exampleAfter: ' per dag. Dit is de uitkomst vóór je de grafieken induikt.',
  useLabel: 'Verbruik per dag',
  batteryLabel: 'Accu, LiFePO4',
  solarLabel: 'Zonnepanelen',
  source: 'Bron: PVGIS, De Bilt, 2013–2020.',
  method: 'Zo rekenen wij',
  system: 'Het systeem',
  balance: 'Energiebalans per maand',
  own: 'Maak je eigen berekening',
  offgrid: 'Zonder paal',
  daysAfter: 'dagen',
  daysBody:
    'Zo lang komt dit voorbeeld toe met een volle accu, zonder bij te laden. Daarna tellen zon, rijden en af en toe een camping.',
  sunEyebrow: 'Zon in Nederland',
  sunTitle: 'In december levert je paneel een tiende van juli',
  july: 'Juli, per 100 Wp',
  december: 'December, per 100 Wp',
  sunBody:
    'Plat op het dak, gemiddeld per dag. Wie ook in het voor- of najaar reist, heeft meer paneel nodig, of laadt bij tijdens het rijden.',
  sunSource: 'Bron: PVGIS (Europese Commissie), De Bilt, gemiddelde 2013–2020.',
  sunChart: 'Opbrengst per dag van 100 Wp per maand',
  howEyebrow: 'Hoe wij werken',
  howTitle: 'Rekenen zoals een vakman, uitleggen zoals een buurman',
  steps: [
    { h: 'Echte data, geen vuistregels', p: 'Zonopbrengst per maand uit PVGIS. Kabeldikte op spanningsval én stroom. Zekeringen die bij de kabel passen.' },
    { h: 'Alles is na te rekenen', p: 'Elke formule en aanname staat op de methodepagina. Klopt er iets niet? Dan passen we het aan.' },
    { h: 'Onafhankelijk', p: 'We verkopen niets. Gaan we ooit naar winkels linken, dan staat dat er altijd bij, en nooit bij een negatief advies.' },
  ],
  howLink: 'Lees hoe we rekenen',
  placeTitle: 'De cijfers zijn van De Bilt.',
  placeBody:
    'Of je in de Veluwe staat of verderop in de bergen: we rekenen met de maand waarin je reist, niet met een gemiddelde zomer.',
  placeLink: 'Bekijk de formules',
  guidesTitle: 'Begrijp wat je koopt',
  guidesLead: 'Korte gidsen zonder jargon, met de getallen die ertoe doen.',
  allGuides: 'Alle gidsen',
  minutes: (n: number) => `${n} min lezen`,
  ctaTitle: 'Klaar om te rekenen?',
  ctaBody: 'Vier stappen. Je uitkomst blijft bewaard op dit apparaat en kun je delen.',
}

type HomeCopy = typeof nl

const en: HomeCopy = {
  metaTitle: 'CamperPower',
  meta:
    'Work out the leisure battery, solar panels and chargers your camper needs. Independent, with a parts list and the checks an electrician would make. Metric units, prices in euros.',
  eyebrow: 'Electrics in your camper',
  h1: 'Know what your camper needs before you buy anything.',
  lead: 'Work out the battery, solar and chargers that fit how you travel. With a full parts list and the checks an electrician would make.',
  cta: 'Size your system',
  flat: 'Battery going flat?',
  proof: ['Free, no account', 'No cookies', 'Formulas are public'],
  startTitle: 'Where do you want to start?',
  startLead: 'Everyone arrives with a different question. Pick yours.',
  entries: [
    {
      href: '/accu-leeg',
      q: 'My battery keeps going flat',
      a: 'Seven questions to find the likely cause, and what to do about it.',
      cta: 'Start the diagnosis',
    },
    {
      href: '/powerstation-of-vast',
      q: 'Power station or a fixed system?',
      a: 'An honest comparison of daily use, charging on the road, and budget.',
      cta: 'Make the choice',
    },
    {
      href: '/configurator',
      q: 'How much battery and solar do I need?',
      a: 'Four steps. You get a system diagram, a parts list and a cable table.',
      cta: 'Size your system',
    },
    {
      href: '/lithium-check',
      q: 'Can I fit lithium in an older camper?',
      a: 'Check whether the electroblock, charger and alternator can handle LiFePO4.',
      cta: 'Do the check',
    },
  ],
  exampleEyebrow: 'Example',
  exampleTitle: 'A tour from May to September',
  exampleBefore: 'A couple, a fridge, a laptop and a roof vent. Together ',
  exampleAfter: ' a day. This is the result before you dig into the charts.',
  useLabel: 'Use per day',
  batteryLabel: 'Battery, LiFePO4',
  solarLabel: 'Solar panels',
  source: 'Source: PVGIS, De Bilt (Netherlands), 2013–2020.',
  method: 'How we calculate',
  system: 'The system',
  balance: 'Energy balance by month',
  own: 'Run your own calculation',
  offgrid: 'Off the hook-up',
  daysAfter: 'days',
  daysBody:
    'That is how long this example lasts on a full battery, with nothing else charging it. After that, sun, driving and the occasional campsite take over.',
  sunEyebrow: 'Sun in the Netherlands',
  sunTitle: 'In December a panel produces a tenth of what it does in July',
  july: 'July, per 100 Wp',
  december: 'December, per 100 Wp',
  sunBody:
    'Flat on the roof, a daily average. If you also travel in spring or autumn you need more panel, or you top up while driving.',
  sunSource:
    'Source: PVGIS (European Commission), De Bilt in the Netherlands, average 2013–2020. A regional choice (Scandinavia, Central Europe, Southern Europe) is not in yet, so every figure on this site uses De Bilt.',
  sunChart: 'Daily yield of 100 Wp, by month',
  howEyebrow: 'How we work',
  howTitle: 'Calculated like an electrician, explained like a neighbour',
  steps: [
    {
      h: 'Real data, not rules of thumb',
      p: 'Monthly solar yield from PVGIS. Cable size from voltage drop and current. Fuses that match the cable.',
    },
    {
      h: 'You can check every number',
      p: 'Every formula and assumption is on the method page. If something is wrong, we change it.',
    },
    {
      h: 'Independent',
      p: 'We sell nothing. If we ever link to shops, the link is labelled, and it never sits next to a warning.',
    },
  ],
  howLink: 'Read how we calculate',
  placeTitle: 'The figures are for De Bilt.',
  placeBody:
    'Whether you are parked in the Netherlands or further into the mountains, we size the system for the month you travel, not for an average summer. Further south in Europe a panel usually produces more. We do not pretend these Dutch figures are a European average.',
  placeLink: 'See the formulas',
  guidesTitle: 'Understand what you are buying',
  guidesLead: 'Short guides, plain language, and the numbers that matter.',
  allGuides: 'All guides',
  minutes: (n) => `${n} min read`,
  ctaTitle: 'Ready to do the sums?',
  ctaBody: 'Four steps. The result stays on this device, and you can share it.',
}

export function homeCopy(locale: Locale): HomeCopy {
  return locale === 'en' ? en : nl
}
