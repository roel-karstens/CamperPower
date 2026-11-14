import type { ComponentKind } from '../lib/calc'
import type { Locale } from '../i18n/locale'

/**
 * Commercial market for prices and affiliate links.
 * Add a key here when a country gets its own programmes or price bands.
 * Do not hardcode shop URLs in pages.
 *
 * TODO(i18n): per-country price bands and affiliate programmes.
 * English (Europe) still uses the Dutch market until those exist.
 * North America is out of scope (AWG, NEC/ABYC, a different range).
 */
export type MarketId = 'nl'

export interface AffiliateLink {
  /** Stable id so another market can offer the same part later. */
  id: string
  market: MarketId
  url: string
  merchant: string
  /** When set, the link belongs on that line of the parts list. */
  component?: ComponentKind
}

export interface PriceMarket {
  id: MarketId
  currency: 'EUR'
}

/**
 * No affiliate URLs yet. The money page says so.
 * Push a link into the matching market when a programme is approved.
 */
export const AFFILIATE_LINKS: readonly AffiliateLink[] = []

export function marketForLocale(locale: Locale): MarketId {
  void locale
  return 'nl'
}

export function priceMarketFor(locale: Locale): PriceMarket {
  return { id: marketForLocale(locale), currency: 'EUR' }
}

export function affiliateLinksFor(locale: Locale, component?: ComponentKind): readonly AffiliateLink[] {
  const market = marketForLocale(locale)
  return AFFILIATE_LINKS.filter(
    (link) => link.market === market && (component === undefined || link.component === component),
  )
}
