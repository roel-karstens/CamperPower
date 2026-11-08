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

export const SOURCE_GROUPS: SourceGroup[] = [
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
