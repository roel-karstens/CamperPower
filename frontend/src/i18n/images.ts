import type { ImageCredit } from '../data/images'
import type { Locale } from './locale'

const STOCK_CHANGES = 'Cropped to 3:2 and converted to WebP.'
const AI_LICENSE = 'AI-generated with Grok Bot GenerateImage'
const AI_SOURCE = 'Generated for CamperPower'

/** English display fields. Dutch stays on the image record itself. */
const EN: Record<string, Partial<Pick<ImageCredit, 'alt' | 'title' | 'usedOn' | 'changes' | 'license' | 'sourceLabel'>>> = {
  hero: {
    alt: 'A cream camper with a dark roof stands in a golden mountain meadow, the sun low, open sky on the left.',
    title: 'Camper in a mountain meadow in golden light',
    usedOn: 'Home, hero',
    changes: 'WebP. 1600 and 2400 px are Lanczos upscales of a 1280 px source.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  couple: {
    alt: 'Two people sit with coffee in the doorway of a camper at sunrise.',
    title: 'Coffee at sunrise in the doorway',
    usedOn: 'Home, example',
    changes: 'WebP. 1600 px is a Lanczos upscale of a 1152 px source.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  interior: {
    alt: 'Camper interior: wood, linen, a blanket and warm light, no electrics in view.',
    title: 'Warm camper interior',
    usedOn: 'Home, how we work',
    changes: 'WebP. 1600 px is a Lanczos upscale of a 1152 px source.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  solarRoof: {
    alt: 'A camper seen from a distance, dark solar panels on the roof, open country around it.',
    title: 'Solar panels on the roof, from a distance',
    usedOn: 'Home, sun in the Netherlands',
    changes: 'WebP. 1600 px is a Lanczos upscale of a 1280 px source.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  forest: {
    alt: 'A dark camper drives along a sandy track through a pine forest.',
    title: 'Camper on a forest track',
    usedOn: 'Home, interlude',
    changes: 'WebP. 1600 px is a Lanczos upscale of a 1280 px source. A faint mark on the rear door was left in place.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  night: {
    alt: 'A camper in the dark, the interior glowing warm under a starry sky.',
    title: 'Camper under the stars',
    usedOn: 'Home, days without charging',
    changes: 'WebP. 1600 px is a Lanczos upscale of a 1280 px source.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  vintage: {
    alt: 'A vintage camper with string lights stands by a still lake at dusk.',
    title: 'Camper by a lake at dusk',
    usedOn: 'Home, closing',
    changes: 'WebP. 1600 px is a Lanczos upscale. The front badge and hubcaps were retouched locally.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  dyke: {
    alt: 'A camper stands by a Dutch dyke, lots of sky and a flat horizon.',
    title: 'Camper by a Dutch dyke',
    usedOn: 'Method',
    changes: 'WebP. 1600 px is a Lanczos upscale. A maker’s badge on the grille was retouched locally.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  guideUse: {
    alt: 'A woman sits in the open back of a camper, a lake and mountains in front of her. The ceiling lights are on.',
    title: 'Living in the van, lights on',
    usedOn: 'Guide: daily energy use',
    changes: STOCK_CHANGES,
  },
  guideSolar: {
    alt: 'A man sits on a tiled roof in the sun, holding a solar panel.',
    title: 'Solar panel on the roof',
    usedOn: 'Guide: solar panels',
    changes: STOCK_CHANGES,
  },
  guideBattery: {
    alt: 'Close-up of the tops of a stack of round battery cells.',
    title: 'Battery cells',
    usedOn: 'Guide: LiFePO4 or AGM',
    changes: STOCK_CHANGES,
  },
  guideDrive: {
    alt: 'A camper drives a winding road through the mist, between trees.',
    title: 'Camper on the road',
    usedOn: 'Guide: DC-DC charger',
    changes: STOCK_CHANGES,
  },
  guideOld: {
    alt: 'A pale blue classic with a roof tent, seen from behind, among trees in warm light.',
    title: 'Classic with a roof tent',
    usedOn: 'Guide: lithium on an old electroblock',
    changes: STOCK_CHANGES,
  },
  guideCable: {
    alt: 'Two hands work with pliers on a bundle of coloured electrical wires.',
    title: 'Hands on electrical wires',
    usedOn: 'Guide: cables and fuses',
    changes: STOCK_CHANGES,
  },
  guideInstall: {
    alt: 'An electrician stands on a ladder, working on cables against a wooden ceiling.',
    title: 'Electrician on a ladder',
    usedOn: 'Guide: installing safely',
    changes: STOCK_CHANGES,
  },
  guidePower: {
    alt: 'A camper van stands with the rear doors open on a sandy track in the dunes, the bed visible.',
    title: 'Camper in the dunes',
    usedOn: 'Guide: power station or a fixed system',
    changes: STOCK_CHANGES,
  },
  heroDunes: {
    alt: 'A cream camper among North Sea dunes in low sunlight.',
    title: 'Camper in the dunes',
    usedOn: 'Not placed (alternative hero)',
    changes: 'WebP. 1600 and 2400 px are Lanczos upscales of a 1280 px source.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
  heroCoast: {
    alt: 'A green camper on a coast road, with sea and sky on the right.',
    title: 'Camper on the coast',
    usedOn: 'Not placed (alternative hero)',
    changes: 'WebP. 1600 and 2400 px are Lanczos upscales. A grille badge and small lettering on the wing were retouched locally.',
    license: AI_LICENSE,
    sourceLabel: AI_SOURCE,
  },
}

export function displayImage<T extends ImageCredit>(image: T, locale: Locale): T {
  if (locale === 'nl') return image
  const extra = EN[image.id]
  return extra ? { ...image, ...extra } : image
}
