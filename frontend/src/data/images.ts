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
    alt: 'Een vrouw zit in de open achterkant van een camper, met een meer en bergen voor haar. De lampjes aan het plafond branden.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Wonen in de camper, lampjes aan',
    creator: 'Alex Azabache',
    sourceUrl: 'https://www.pexels.com/photo/woman-in-the-back-of-a-van-looking-at-mountains-4171211/',
    usedOn: 'Gids dagverbruik',
  }),
  guideSolar: stock({
    id: 'guideSolar',
    src: '/images/g-zon',
    alt: 'Een man zit op een pannendak in de zon en houdt een zonnepaneel vast.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Zonnepaneel op het dak',
    creator: 'Kindel Media',
    sourceUrl: 'https://www.pexels.com/photo/man-in-black-shirt-sitting-on-brown-roof-9875409/',
    usedOn: 'Gids zonnepanelen',
  }),
  guideBattery: stock({
    id: 'guideBattery',
    src: '/images/g-accu',
    alt: 'Close-up van de bovenkant van een stapel ronde batterijcellen.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Batterijcellen',
    creator: 'Hilary Halliwell',
    sourceUrl: 'https://www.pexels.com/photo/close-up-photo-of-batteries-698485/',
    usedOn: 'Gids LiFePO4 of AGM',
  }),
  guideDrive: stock({
    id: 'guideDrive',
    src: '/images/g-rijden',
    alt: 'Een camper rijdt over een bochtige weg door de mist, tussen bomen.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Camper op de weg',
    creator: 'Gabriel Hohol',
    sourceUrl: 'https://www.pexels.com/photo/vehicle-on-the-road-3593923/',
    usedOn: 'Gids DC-DC-lader',
  }),
  guideOld: stock({
    id: 'guideOld',
    src: '/images/g-caravan',
    alt: 'Een lichtblauwe klassieker met een daktent, van achteren gezien, tussen bomen in warm licht.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Klassieker met daktent',
    creator: 'Luca Dross',
    sourceUrl: 'https://www.pexels.com/photo/vintage-blue-caravan-in-peaceful-park-setting-33339209/',
    usedOn: 'Gids lithium op een oude EBL',
  }),
  guideCable: stock({
    id: 'guideCable',
    src: '/images/g-kabel',
    alt: 'Twee handen werken met een tang aan een bundel gekleurde elektrische draden.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Handen aan elektrische draden',
    creator: 'Karolina Grabowska',
    sourceUrl: 'https://www.pexels.com/photo/photo-of-a-person-s-hands-cutting-a-green-cable-7285975/',
    usedOn: 'Gids kabels en zekeringen',
  }),
  guideInstall: stock({
    id: 'guideInstall',
    src: '/images/g-install',
    alt: 'Een elektricien staat op een ladder en werkt aan kabels tegen een houten plafond.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Elektricien op een ladder',
    creator: 'Audy of Course',
    sourceUrl: 'https://www.pexels.com/photo/a-female-electrician-standing-on-a-ladder-and-holding-cables-20500461/',
    usedOn: 'Gids veilig installeren',
  }),
  guidePower: stock({
    id: 'guidePower',
    src: '/images/g-camper',
    alt: 'Een camperbus staat met open achterdeuren op een zandpad in de duinen, het bed zichtbaar.',
    ratio: 1600 / 1066,
    widths: W16,
    title: 'Camper in de duinen',
    creator: 'Kampus Production',
    sourceUrl: 'https://www.pexels.com/photo/white-and-brown-camper-trailer-on-brown-field-7476895/',
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
