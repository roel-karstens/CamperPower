import type { TriState } from '../lib/calc'
import type { Locale } from './locale'
import { monthNames } from './months'

export interface TextLine {
  title: string
  body: string
  link?: { href: string; label: string }
}

/**
 * User-facing sentences from the calculator.
 * Dutch strings stay as they were. English is for European camper owners:
 * leisure battery, shore power, campsite hook-up. Units stay metric.
 */
export function calcText(locale: Locale) {
  const month = (m: number) => monthNames(locale).long[m]
  const nl = locale === 'nl'

  return {
    cable: {
      starter: nl ? 'Startaccu → DC-DC-lader' : 'Starter battery → DC-DC charger',
      dcdc: nl ? 'DC-DC-lader → accu' : 'DC-DC charger → leisure battery',
      mppt: nl ? 'Zonnelaadregelaar → accu' : 'Solar controller → leisure battery',
      charger: nl ? 'Walstroomlader → accu' : 'Shore charger → leisure battery',
      dcloads: nl ? 'Accu → zekeringkast 12 V' : 'Leisure battery → 12 V fuse box',
      inverter: nl ? 'Accu → omvormer' : 'Leisure battery → inverter',
    },
    battery(keep: boolean, existingAh: number, ah: number, bms: number, limitedBy: 'energy' | 'current', reserveDays: number) {
      const days = nl ? (reserveDays === 1 ? 'dag' : 'dagen') : reserveDays === 1 ? 'day' : 'days'
      return {
        title: keep
          ? nl
            ? 'Je huidige LiFePO4-accu'
            : 'Your current LiFePO4 battery'
          : nl
            ? 'LiFePO4-accu'
            : 'LiFePO4 battery',
        spec: keep
          ? nl
            ? `${existingAh} Ah volstaat (nodig: ${ah} Ah)`
            : `${existingAh} Ah is enough (you need ${ah} Ah)`
          : nl
            ? `${ah} Ah, 12,8 V, BMS ≥ ${bms} A`
            : `${ah} Ah, 12.8 V, BMS ≥ ${bms} A`,
        why:
          limitedBy === 'current'
            ? nl
              ? 'Groter dan je verbruik vraagt, zodat de accu de stroom voor de omvormer kan leveren.'
              : 'Larger than your daily use, so the battery can supply the inverter.'
            : nl
              ? `Ontworpen op ${reserveDays} ${days} zonder laden, met 10% marge onderin, afgerond naar een gangbare maat.`
              : `Sized for ${reserveDays} ${days} without charging, with 10% left in reserve, then rounded up to a common size.`,
      }
    },
    solar(wp: number, capped: boolean, designMonth: number, neededWp: number, roof: number) {
      const name = month(designMonth)
      let why: string
      if (capped) {
        why = nl
          ? `Zoveel past er op je dak. In ${name} is ${neededWp} Wp nodig.`
          : `That is all that fits on the roof. In ${name} you would need ${neededWp} Wp.`
      } else if (roof > wp) {
        why = nl
          ? `Genoeg voor ${name}, je minst zonnige reismaand. Er past ${roof} Wp op je dak: meer paneel geeft marge voor dagen dat je stilstaat.`
          : `Enough for ${name}, your least sunny travel month. The roof fits ${roof} Wp: more panel gives you margin on days you stay put.`
      } else {
        why = nl
          ? `Genoeg voor ${name}, je minst zonnige reismaand.`
          : `Enough for ${name}, your least sunny travel month.`
      }
      return {
        title: nl ? 'Zonnepanelen' : 'Solar panels',
        spec: nl ? `${wp} Wp, vlak op het dak` : `${wp} Wp, flat on the roof`,
        why,
      }
    },
    mppt(amps: number, wp: number, rawAmps: number) {
      return {
        title: nl ? 'MPPT-zonnelaadregelaar' : 'MPPT solar controller',
        spec: nl ? `${amps} A, ingang 75 of 100 V` : `${amps} A, 75 or 100 V input`,
        why: nl
          ? `${wp} Wp ÷ 12,8 V ≈ ${rawAmps} A laadstroom.`
          : `${wp} Wp ÷ 12.8 V ≈ ${rawAmps} A of charge current.`,
      }
    },
    dcdc(amps: number, euro6: TriState, wh: number) {
      const smart = euro6 !== 'no'
      return {
        title: nl ? 'DC-DC-lader' : 'DC-DC charger',
        spec: `${amps} A${smart ? (nl ? ', geschikt voor slimme dynamo (Euro 6)' : ', for a smart alternator (Euro 6)') : ''}`,
        why: nl
          ? `Laadt je accu tijdens het rijden met ongeveer ${wh} Wh per dag.`
          : `Charges the leisure battery while you drive, about ${wh} Wh a day.`,
      }
    },
    charger(amps: number, ebl: TriState) {
      return {
        title: nl ? 'Walstroomlader' : 'Shore-power charger',
        spec: nl ? `${amps} A met LiFePO4-profiel` : `${amps} A with a LiFePO4 profile`,
        why:
          ebl === 'yes'
            ? nl
              ? 'Alleen nodig als je EBL geen lithiumprofiel heeft.'
              : 'Only needed when the electroblock has no lithium profile.'
            : nl
              ? 'Volladen op de camping of thuis.'
              : 'For a full charge on a campsite or at home.',
      }
    },
    inverter(watts: number, peakW: number) {
      return {
        title: nl ? 'Omvormer' : 'Inverter',
        spec: nl ? `${watts} W zuivere sinus` : `${watts} W pure sine`,
        why: nl
          ? `Voor je 230V-apparaten. Grootste piek: ${peakW} W.`
          : `For your 230 V kit. Largest spike: ${peakW} W.`,
      }
    },
    monitor(shunt: number) {
      return {
        title: nl ? 'Accumonitor met shunt' : 'Battery monitor with shunt',
        spec: nl ? `${shunt} A shunt` : `${shunt} A shunt`,
        why: nl
          ? 'Laat zien hoeveel er écht in je accu zit. De spanning alleen zegt bij lithium weinig.'
          : 'Shows what is actually left in the battery. With lithium, voltage alone tells you very little.',
      }
    },
    wiring(mm2: number, fuse: number) {
      return {
        title: nl ? 'Kabels, zekeringen en hoofdschakelaar' : 'Cables, fuses and a main switch',
        spec: nl
          ? `${mm2} mm² dikste kabel, hoofdzekering ${fuse} A`
          : `${mm2} mm² thickest cable, main fuse ${fuse} A`,
        why: nl
          ? 'Elke plus-kabel krijgt een zekering zo dicht mogelijk bij de accu.'
          : 'Every positive cable gets a fuse as close to the battery as possible.',
      }
    },
    checks: {
      agm(): TextLine {
        return {
          title: nl ? 'Combineer lithium niet met je AGM-accu' : 'Do not mix lithium with your AGM battery',
          body: nl
            ? 'Vervang de AGM-accu in zijn geheel. Parallel schakelen met LiFePO4 geeft ongelijke laadstromen en kan beide accu’s beschadigen.'
            : 'Replace the AGM battery outright. Wiring it in parallel with LiFePO4 unbalances the charge current and can damage both.',
          link: { href: '/gidsen/lifepo4-of-agm', label: nl ? 'LiFePO4 of AGM' : 'LiFePO4 or AGM' },
        }
      },
      ebl(known: boolean): TextLine {
        return {
          title: known
            ? nl
              ? 'Controleer je EBL vóór je overstapt'
              : 'Check the electroblock before you switch'
            : nl
              ? 'Zit er een EBL in je camper?'
              : 'Does the camper have an electroblock?',
          body: nl
            ? 'Veel oudere elektroblokken (Schaudt, Nordelettronica, CBE) laden met een loodaccu-profiel. Dat is te laag of te hoog voor LiFePO4.'
            : 'Many older electroblocks (Schaudt, Nordelettronica, CBE) charge with a lead-acid profile. That is too low or too high for LiFePO4.',
          link: { href: '/lithium-check', label: nl ? 'Doe de lithium-check' : 'Do the lithium check' },
        }
      },
      euro6(known: boolean): TextLine {
        return {
          title: known
            ? nl
              ? 'Slimme dynamo: kies de juiste DC-DC-lader'
              : 'Smart alternator: pick the right DC-DC charger'
            : nl
              ? 'Weet je of je camper een slimme dynamo heeft?'
              : 'Do you know if the camper has a smart alternator?',
          body: nl
            ? 'Bij Euro 6 en de meeste campers vanaf 2015 zakt de dynamospanning tijdens het rijden. De DC-DC-lader moet dan op het motorsignaal schakelen, niet alleen op spanning.'
            : 'On Euro 6, and on most campers from 2015, alternator voltage drops while you drive. The DC-DC charger then has to follow the engine signal, not voltage alone.',
          link: { href: '/gidsen/dc-dc-lader', label: nl ? 'Over DC-DC-laders' : 'About DC-DC chargers' },
        }
      },
      roof(designMonth: number, neededWp: number, wp: number, gapWh: number, days: number): TextLine {
        const name = month(designMonth)
        return {
          title: nl ? `Je dak is te klein voor ${name}` : `The roof is too small for ${name}`,
          body: nl
            ? `Je hebt ${neededWp} Wp nodig, maar er past ${wp} Wp. Je mist dan ongeveer ${gapWh} Wh per dag. Je volle accu overbrugt dat ${days} dagen, daarna moet je rijden of walstroom pakken.`
            : `You need ${neededWp} Wp, but only ${wp} Wp fits. That leaves you about ${gapWh} Wh short each day. A full battery covers ${days} days, then you need to drive or find a hook-up.`,
        }
      },
      winter(): TextLine {
        return {
          title: nl ? 'Winterreizen vragen om een accu met verwarming' : 'Winter travel needs a heated battery',
          body: nl
            ? 'LiFePO4 mag niet laden onder 0 °C. Kies een accu met ingebouwde verwarming of plaats hem binnen in de camper. In de winter levert zon bovendien weinig op.'
            : 'LiFePO4 must not be charged below 0 °C. Choose a battery with a built-in heater, or put it inside the living space. In winter the panels produce little anyway.',
        }
      },
      current(amps: number): TextLine {
        return {
          title: nl ? 'De omvormer bepaalt je accugrootte' : 'The inverter sets the battery size',
          body: nl
            ? `Je omvormer trekt tot ${amps} A. Een kleinere accu kan dat vaak niet leveren. Wil je een kleinere accu? Laat dan het zwaarste 230V-apparaat thuis.`
            : `The inverter draws up to ${amps} A. A smaller battery often cannot supply that. Want a smaller battery? Leave the heaviest 230 V appliance at home.`,
        }
      },
      bigInverter(watts: number, amps: number): TextLine {
        return {
          title: nl
            ? 'Grote stromen: laat dit door een vakman aansluiten'
            : 'High current: have an electrician connect this',
          body: nl
            ? `Een omvormer van ${watts} W trekt meer dan ${amps} A. Een losse kabelschoen kan dan warm worden en brand veroorzaken.`
            : `A ${watts} W inverter draws more than ${amps} A. A loose lug can heat up and start a fire.`,
          link: { href: '/gidsen/veilig-installeren', label: nl ? 'Veilig installeren' : 'Installing safely' },
        }
      },
      second(): TextLine {
        return {
          title: nl ? 'Uitbreiden met een tweede accu?' : 'Add a second battery?',
          body: nl
            ? 'Kan, mits het hetzelfde merk, type en dezelfde leeftijd is. Anders: vervangen door één grotere accu.'
            : 'You can, if it is the same brand, type and age. Otherwise replace both with one larger battery.',
        }
      },
      disclaimer(): TextLine {
        return {
          title: nl ? 'Dit is een indicatie, geen installatieplan' : 'This is a guide, not an installation plan',
          body: nl
            ? 'We rekenen met gemiddelden. Laat de aansluiting en zekeringen controleren door een vakman voor je de stroom inschakelt.'
            : 'The figures are averages. Have the connections and fuses checked by an electrician before you switch the power on.',
          link: { href: '/methode', label: nl ? 'Zo rekenen wij' : 'How we calculate' },
        }
      },
    },
  }
}
