export interface ImageCredit {
  id: string
  src: string
  alt: string
  /** Width / height. */
  ratio: number
  widths: readonly number[]
  title: string
  creator: string
  license: string
  licenseUrl: string
  sourceUrl: string
  sourceLabel: string
  usedOn: string
  changes: string
}

const AI = 'AI-gegenereerd met Grok Bot GenerateImage'
const PEXELS = 'https://www.pexels.com/license/'

function ai(
  partial: Omit<ImageCredit, 'creator' | 'license' | 'licenseUrl' | 'sourceUrl' | 'sourceLabel'> & { changes: string },
): ImageCredit {
  return {
    ...partial,
    creator: 'Grok Bot GenerateImage',
    license: AI,
    licenseUrl: '',
    sourceUrl: '',
    sourceLabel: 'Gegenereerd voor CamperPower',
  }
}

function stock(partial: Omit<ImageCredit, 'license' | 'licenseUrl' | 'sourceLabel' | 'changes'>): ImageCredit {
  return {
    ...partial,
    license: 'Pexels License',
    licenseUrl: PEXELS,
    sourceLabel: 'Pexels',
    changes: 'Bijgesneden naar 3:2 en omgezet naar WebP.',
  }
}

const W16 = [800, 1600] as const
const HERO_W = [800, 1600, 2400] as const

export const IMAGES = {
  hero: ai({
    id: 'hero',
    src: '/images/hero-mountains',
    alt: 'Een crème camper met donker dak staat in een gouden bergweide, de zon laag, veel lucht links.',
    ratio: 16 / 9,
    widths: HERO_W,
    title: 'Camper in een bergweide bij gouden licht',
    usedOn: 'Home, hero',
    changes: 'WebP. 1600 en 2400 px zijn Lanczos-opschalingen van een bron van 1280 px.',
  }),
  couple: ai({
    id: 'couple',
    src: '/images/couple-sunrise-coffee',
    alt: 'Twee mensen zitten met koffie in de deuropening van een camper bij zonsopkomst.',
    ratio: 4 / 3,
    widths: W16,
    title: 'Koffie bij zonsopkomst in de deuropening',
    usedOn: 'Home, voorbeeld',
    changes: 'WebP. 1600 px is een Lanczos-opschaling van een bron van 1152 px.',
  }),
  interior: ai({
    id: 'interior',
    src: '/images/interior-cozy-van',
    alt: 'Interieur van een camper: hout, linnen, een deken en warm licht, zonder zichtbare elektra.',
    ratio: 4 / 3,
    widths: W16,
    title: 'Warm interieur van een camper',
    usedOn: 'Home, hoe wij werken',
    changes: 'WebP. 1600 px is een Lanczos-opschaling van een bron van 1152 px.',
  }),
  solarRoof: ai({
    id: 'solarRoof',
    src: '/images/solar-roof-sunlight',
    alt: 'Een camper van een afstand, met donkere zonnepanelen op het dak, in open land.',
    ratio: 16 / 9,
    widths: W16,
    title: 'Zonnepanelen op het dak, van een afstand',
    usedOn: 'Home, zon in Nederland',
    changes: 'WebP. 1600 px is een Lanczos-opschaling van een bron van 1280 px.',
  }),
  forest: ai({
    id: 'forest',
    src: '/images/forest-road-netherlands',
    alt: 'Een donkere camper rijdt over een zandpad door een naaldbos.',
    ratio: 16 / 9,
    widths: W16,
    title: 'Camper op een bospad',
    usedOn: 'Home, tussenstuk',
    changes: 'WebP. 1600 px is een Lanczos-opschaling van een bron van 1280 px. Een vaag merkteken op de achterdeur is blijven staan.',
  }),
  night: ai({
    id: 'night',
    src: '/images/night-stars-glow',
    alt: 'Een camper in het donker, het interieur gloeit warm onder een sterrenhemel.',
    ratio: 16 / 9,
    widths: W16,
    title: 'Camper onder de sterren',
    usedOn: 'Home, dagen zonder laden',
    changes: 'WebP. 1600 px is een Lanczos-opschaling van een bron van 1280 px.',
  }),
  vintage: ai({
    id: 'vintage',
    src: '/images/vintage-lake-dusk',
    alt: 'Een vintage camper met lichtslingers staat aan een stil meer in de schemer.',
    ratio: 16 / 9,
    widths: W16,
    title: 'Camper aan een meer in de schemer',
    usedOn: 'Home, afsluiting',
    changes: 'WebP. 1600 px is een Lanczos-opschaling. Voorembleem en naafdoppen zijn lokaal geretoucheerd.',
  }),
  dyke: ai({
    id: 'dyke',
    src: '/images/dutch-beach-dyke',
    alt: 'Een camper staat bij een Nederlandse dijk, veel lucht en een vlakke horizon.',
    ratio: 16 / 9,
    widths: W16,
    title: 'Camper bij een Nederlandse dijk',
    usedOn: 'Methode',
    changes: 'WebP. 1600 px is een Lanczos-opschaling. Een fabrikantsbadge op de grille is lokaal geretoucheerd.',
  }),
  guideUse: stock({
    id: 'guideUse',
    src: '/images/g-verbruik',
    alt: 'Een witte koffiemok en een schrijfblok op een houten tafel.',
    ratio: 3 / 2,
    widths: W16,
    title: 'Black Coffee in White Mug with Notebook',
    creator: 'Nur Nur',
    sourceUrl: 'https://www.pexels.com/photo/black-coffee-in-white-mug-with-notebook-29460193/',
    usedOn: 'Gids dagverbruik',
  }),
  guideSolar: stock({
    id: 'guideSolar',
    src: '/images/g-zon',
    alt: 'Zonnepanelen op een rond dak, met bomen eromheen.',
    ratio: 3 / 2,
    widths: W16,
    title: 'Circular Rooftop with Solar Panels in Forested Area',
    creator: 'Stefan de Vries',
    sourceUrl: 'https://www.pexels.com/photo/circular-rooftop-with-solar-panels-in-forested-area-29206499/',
    usedOn: 'Gids zonnepanelen',
  }),
  guideBattery: stock({
    id: 'guideBattery',
    src: '/images/g-bos',
    alt: 'Een lichte bus staat geparkeerd op een bospad tussen hoge sparren.',
    ratio: 3 / 2,
    widths: W16,
    title: 'A White Volkswagen Transporter Parked in the Forest',
    creator: 'Stepan Vrany',
    sourceUrl: 'https://www.pexels.com/photo/a-white-van-parked-in-the-middle-of-a-forest-27383865/',
    usedOn: 'Gids LiFePO4 of AGM',
  }),
  guideDrive: stock({
    id: 'guideDrive',
    src: '/images/g-rijden',
    alt: 'Uitzicht door een natte voorruit op een stille weg met herfstbomen.',
    ratio: 3 / 2,
    widths: W16,
    title: 'From car view of empty rural road in autumn forest',
    creator: 'Lisa Fotios',
    sourceUrl: 'https://www.pexels.com/photo/from-car-view-of-empty-rural-road-in-autumn-forest-5898609/',
    usedOn: 'Gids DC-DC-lader',
  }),
  guideOld: stock({
    id: 'guideOld',
    src: '/images/g-caravan',
    alt: 'Een lichte caravan staat op een helling, met laag zonlicht over de heuvels.',
    ratio: 3 / 2,
    widths: W16,
    title: 'Camper Parked on a Hill at Sunset',
    creator: 'Matheus Bertelli',
    sourceUrl: 'https://www.pexels.com/photo/camper-parked-on-a-hill-at-sunset-7163672/',
    usedOn: 'Gids lithium op een oude EBL',
  }),
  guideCable: stock({
    id: 'guideCable',
    src: '/images/g-kabel',
    alt: 'Een enkele donkere kabel ligt in een boog op een lichte tegelvloer.',
    ratio: 3 / 2,
    widths: W16,
    title: 'Black Wire on White Floor',
    creator: 'La Miko',
    sourceUrl: 'https://www.pexels.com/photo/black-wire-on-white-floor-3616765/',
    usedOn: 'Gids kabels en zekeringen',
  }),
  guideInstall: stock({
    id: 'guideInstall',
    src: '/images/g-werkbank',
    alt: 'Twee handen houden een plaat hout vast aan een werkbank.',
    ratio: 3 / 2,
    widths: W16,
    title: 'Person in Gray Long Sleeve Holding the Wood on Table',
    creator: 'cottonbro studio',
    sourceUrl: 'https://www.pexels.com/photo/person-in-gray-long-sleeve-holding-the-wood-on-table-7492586/',
    usedOn: 'Gids veilig installeren',
  }),
  guidePower: stock({
    id: 'guidePower',
    src: '/images/g-avond',
    alt: 'Een caravan staat tussen berken, met een oranje avondlucht erachter.',
    ratio: 3 / 2,
    widths: W16,
    title: 'A Camper Van at Sunset',
    creator: 'Adriana Coulson',
    sourceUrl: 'https://www.pexels.com/photo/a-camper-van-at-sunset-20551917/',
    usedOn: 'Gids powerstation of vaste installatie',
  }),
} satisfies Record<string, ImageCredit>

/** Alternative heroes kept in the repo, not placed on a page. */
export const HERO_ALTERNATIVES: ImageCredit[] = [
  ai({
    id: 'heroDunes',
    src: '/images/hero-dunes',
    alt: 'Een crème camper tussen Noordzeeduinen bij laag zonlicht.',
    ratio: 16 / 9,
    widths: HERO_W,
    title: 'Camper in de duinen',
    usedOn: 'Niet geplaatst (alternatieve hero)',
    changes: 'WebP. 1600 en 2400 px zijn Lanczos-opschalingen van een bron van 1280 px.',
  }),
  ai({
    id: 'heroCoast',
    src: '/images/hero-coast',
    alt: 'Een groene camper op een kustweg, met zee en lucht aan de rechterkant.',
    ratio: 16 / 9,
    widths: HERO_W,
    title: 'Camper aan de kust',
    usedOn: 'Niet geplaatst (alternatieve hero)',
    changes:
      'WebP. 1600 en 2400 px zijn Lanczos-opschalingen. Een grille-embleem en kleine lettering op het spatbord zijn lokaal geretoucheerd.',
  }),
]
