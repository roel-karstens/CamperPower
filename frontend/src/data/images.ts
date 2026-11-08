export interface ImageCredit {
  id: string
  src: string
  alt: string
  /** Width / height. */
  ratio: number
  title: string
  creator: string
  license: string
  licenseUrl: string
  sourceUrl: string
  usedOn: string
}

const CHANGES = 'Verkleind en omgezet naar WebP.'

export const IMAGES = {
  hero: {
    id: 'hero',
    src: '/images/camper-landschap',
    alt: 'Een camperbus staat in de berm van een landweg, de schuifdeur open, met heuvels en bos op de achtergrond.',
    ratio: 1600 / 1067,
    title: 'Campervan at the side of the road in the countryside with its door open',
    creator: 'CruiseAmerica',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Campervan_at_the_side_of_the_road_in_the_countryside_with_its_door_open.jpg',
    usedOn: 'Home',
  },
  departure: {
    id: 'departure',
    src: '/images/camper-vertrek',
    alt: 'Een vrouw zwaait vanuit de deur van een ingerichte camperbus.',
    ratio: 1600 / 1064,
    title: 'Older woman waves goodbye while preparing to travel in a cozy camper van interior',
    creator: 'Shixart1985',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Older_woman_waves_goodbye_while_preparing_to_travel_in_a_cozy_camper_van_interior.jpg',
    usedOn: 'Home, gidsenoverzicht',
  },
  selfBuild: {
    id: 'selfBuild',
    src: '/images/zelfbouw-camper',
    alt: 'Achterkant van een zelf ingerichte bus met open deuren: bed boven, opbergruimte en gereedschap onder.',
    ratio: 1600 / 1592,
    title: 'Self-converted Sprinter Camper Van',
    creator: 'Moreteekay',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Self-converted_Sprinter_Camper_Van.jpg',
    usedOn: 'Gids veilig installeren',
  },
  battery: {
    id: 'battery',
    src: '/images/lifepo4-accu',
    alt: 'Een nieuwe 12,8V LiFePO4-accu van 200 Ah in de doos.',
    ratio: 1600 / 1200,
    title: '12V 200Ah lithium iron phosphate battery',
    creator: 'HasanAbuarja',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:12V_200Ah_lithium_iron_phosphate_battery.jpg',
    usedOn: 'Gids LiFePO4 of AGM',
  },
  charger: {
    id: 'charger',
    src: '/images/walstroomlader',
    alt: 'Een blauwe acculader met laadstanden, waaronder een stand voor lithium (Li-ion).',
    ratio: 1600 / 1536,
    title: 'Victron Phoenix smart charger 12V 50A',
    creator: 'S.J. de Waard',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Victron_Phoenix_smart_charger_12V_50A.JPG',
    usedOn: 'Lithium-check, gids lithium op een oude EBL',
  },
} satisfies Record<string, ImageCredit>

export const IMAGE_CHANGES = CHANGES
