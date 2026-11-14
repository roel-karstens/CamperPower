import type { Locale } from '../i18n/locale'

export interface Source {
  title: string
  publisher: string
  url: string
  usedFor: string
}

export interface SourceGroup {
  title: string
  intro: string
  items: Source[]
}

const SOURCE_GROUPS_NL: SourceGroup[] = [
  {
    title: 'Rekendata',
    intro: 'Deze data zitten rechtstreeks in de rekenmodule.',
    items: [
      {
        title: 'PVGIS 5.2: maandelijkse instraling',
        publisher: 'Europese Commissie, Joint Research Centre',
        url: 'https://re.jrc.ec.europa.eu/pvg_tools/en/',
        usedFor:
          'Gemiddelde dagelijkse instraling op een horizontaal vlak per maand, De Bilt (52,10° N, 5,18° O), PVGIS-SARAH2, 2013–2020.',
      },
      {
        title: 'Wiring Unlimited',
        publisher: 'Victron Energy',
        url: 'https://www.victronenergy.com/upload/documents/Wiring-Unlimited-EN.pdf',
        usedFor: 'Spanningsval, kabeldoorsnede, zekeringen en het belang van korte, dikke accukabels.',
      },
    ],
  },
  {
    title: 'Achtergrond over campers en stroom',
    intro: 'Hiermee hebben we gecontroleerd welke vragen camperaars stellen en welke vuistregels er rondgaan.',
    items: [
      {
        title: 'Elektriciteit in je caravan of camper',
        publisher: 'ANWB',
        url: 'https://www.anwb.nl/kamperen/caravan/elektriciteit',
        usedFor: 'Walstroom, aansluitwaarden op campings en veilig gebruik.',
      },
      {
        title: 'Zonnepanelen op je camper',
        publisher: 'Campercontact',
        url: 'https://www.campercontact.com/nl/blog/camper-zonnepanelen',
        usedFor: 'Praktijkvragen over zonnepanelen op camperdaken.',
      },
      {
        title: 'Zonnepaneel op je camper',
        publisher: 'Anker SOLIX',
        url: 'https://www.ankersolix.com/nl/blogs/thuisbatterij-101/zonnepaneel-op-camper',
        usedFor: 'Hoe een fabrikant het verschil tussen powerstations en vaste systemen uitlegt.',
      },
    ],
  },
  {
    title: 'Forums: waar camperaars tegenaan lopen',
    intro: 'Vooral gebruikt om de juiste vragen te stellen, niet als technische bron.',
    items: [
      {
        title: 'Camperforum.nl',
        publisher: 'Camperforum',
        url: 'https://www.camperforum.nl/',
        usedFor: 'Draadjes over het moderniseren van de camperinstallatie en de overstap naar LiFePO4.',
      },
      {
        title: 'Discussie over een camperinstallatie',
        publisher: 'Circuits Online',
        url: 'https://www.circuitsonline.net/forum/view/172085',
        usedFor: 'Technische vragen van zelfbouwers over laden en beveiliging.',
      },
    ],
  },
]

/** Dutch source list. Kept under the old name for anything that still imports it. */
export const SOURCE_GROUPS = SOURCE_GROUPS_NL

const SOURCE_GROUPS_EN: SourceGroup[] = [
  {
    title: 'Calculation data',
    intro: 'This data goes straight into the calculator.',
    items: [
      {
        title: 'PVGIS 5.2: monthly irradiation',
        publisher: 'European Commission, Joint Research Centre',
        url: 'https://re.jrc.ec.europa.eu/pvg_tools/en/',
        usedFor:
          'Average daily irradiation on a horizontal plane, by month, for De Bilt (52.10° N, 5.18° E), PVGIS-SARAH2, 2013–2020. Other European regions are not in the calculator yet.',
      },
      {
        title: 'Wiring Unlimited',
        publisher: 'Victron Energy',
        url: 'https://www.victronenergy.com/upload/documents/Wiring-Unlimited-EN.pdf',
        usedFor: 'Voltage drop, cable cross-section, fuses, and why battery cables should be short and thick.',
      },
    ],
  },
  {
    title: 'Background on campers and electricity',
    intro: 'Used to check which questions camper owners ask, and which rules of thumb are in circulation. Some of these pages are in Dutch.',
    items: [
      {
        title: 'Elektriciteit in je caravan of camper',
        publisher: 'ANWB',
        url: 'https://www.anwb.nl/kamperen/caravan/elektriciteit',
        usedFor: 'Shore power, campsite supply ratings and safe use. Dutch-language page.',
      },
      {
        title: 'Zonnepanelen op je camper',
        publisher: 'Campercontact',
        url: 'https://www.campercontact.com/nl/blog/camper-zonnepanelen',
        usedFor: 'Practical questions about solar on camper roofs. Dutch-language page.',
      },
      {
        title: 'Zonnepaneel op je camper',
        publisher: 'Anker SOLIX',
        url: 'https://www.ankersolix.com/nl/blogs/thuisbatterij-101/zonnepaneel-op-camper',
        usedFor: 'How a manufacturer explains the difference between power stations and fixed systems. Dutch-language page.',
      },
    ],
  },
  {
    title: 'Forums: what camper owners run into',
    intro: 'Used to ask the right questions, not as a technical source. The threads are in Dutch.',
    items: [
      {
        title: 'Camperforum.nl',
        publisher: 'Camperforum',
        url: 'https://www.camperforum.nl/',
        usedFor: 'Threads about modernising a camper installation and switching to LiFePO4.',
      },
      {
        title: 'Discussie over een camperinstallatie',
        publisher: 'Circuits Online',
        url: 'https://www.circuitsonline.net/forum/view/172085',
        usedFor: 'Technical questions from people building their own systems, about charging and protection.',
      },
    ],
  },
]

export function sourceGroups(locale: Locale): SourceGroup[] {
  return locale === 'en' ? SOURCE_GROUPS_EN : SOURCE_GROUPS_NL
}
