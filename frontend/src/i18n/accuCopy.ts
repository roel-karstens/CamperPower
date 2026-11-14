import type { Locale } from './locale'

const nl = {
  metaTitle: 'Accu steeds leeg? Vind de oorzaak',
  meta: 'Is de woonaccu van je camper steeds leeg? Beantwoord zeven vragen en zie de waarschijnlijke oorzaken, met wat je eraan kunt doen.',
  eyebrow: 'Diagnose',
  title: 'Accu steeds leeg?',
  lead: 'Zeven vragen, geen meetapparatuur nodig. Je krijgt de waarschijnlijke oorzaken op volgorde, met wat je eraan kunt doen.',
  groups: { happens: 'Wat er gebeurt', charge: 'Laden', inverter: 'Omvormer' },
  q1: '1. Wanneer is de accu leeg?',
  when: [
    { value: 'night' as const, label: 'Al na één nacht', detail: 'Terwijl hij vol leek' },
    { value: 'days' as const, label: 'Na twee of drie dagen vrij staan', detail: 'Zonder walstroom' },
    { value: 'driving' as const, label: 'Zelfs als ik veel rijd', detail: 'Rijden lijkt niet te helpen' },
    { value: 'storage' as const, label: 'Na een tijd stilstaan', detail: 'In de stalling of thuis' },
  ],
  q2: '2. Wat voor woonaccu heb je?',
  kind: [
    { value: 'lead' as const, label: 'AGM, gel of nat', detail: 'Loodaccu, zwaar' },
    { value: 'lithium' as const, label: 'Lithium (LiFePO4)' },
    { value: 'unknown' as const, label: 'Weet ik niet' },
  ],
  q3: '3. Hoe oud is de accu?',
  age: [
    { value: 'new' as const, label: 'Tot 3 jaar' },
    { value: 'mid' as const, label: '3 tot 6 jaar' },
    { value: 'old' as const, label: 'Ouder dan 6 jaar' },
    { value: 'unknown' as const, label: 'Weet ik niet' },
  ],
  q4: '4. Wordt de accu voller als je een uur rijdt?',
  q4hint: 'Kijk op het bedieningspaneel of de accumonitor, voor en na het rijden.',
  drive: [
    { value: 'yes' as const, label: 'Ja, duidelijk' },
    { value: 'little' as const, label: 'Nauwelijks' },
    { value: 'unknown' as const, label: 'Weet ik niet' },
  ],
  q5: '5. Bouwjaar van de basisauto',
  q5hint: 'Staat op het kentekenbewijs. Vanaf 2015 meestal Euro 6 met slimme dynamo.',
  year: [
    { value: 'pre2015' as const, label: 'Vóór 2015' },
    { value: 'post2015' as const, label: '2015 of later' },
    { value: 'unknown' as const, label: 'Weet ik niet' },
  ],
  q6: '6. Zonnepaneel op het dak?',
  solar: [
    { value: 'none' as const, label: 'Geen' },
    { value: 'small' as const, label: 'Tot 150 Wp' },
    { value: 'large' as const, label: 'Meer dan 150 Wp' },
  ],
  q7: '7. Staat de omvormer (230V-stopcontact) vaak aan?',
  inverter: [
    { value: 'on' as const, label: 'Ja, meestal' },
    { value: 'off' as const, label: 'Alleen als ik hem gebruik' },
    { value: 'none' as const, label: 'Geen omvormer' },
  ],
  submit: 'Bekijk de oorzaken',
  done: 'Alle vragen beantwoord.',
  progress: (n: number, total: number) => `${n} van ${total} beantwoord`,
  likely: 'Meest waarschijnlijk',
  also: 'Ook waarschijnlijk',
  possible: 'Mogelijk',
  less: 'Minder waarschijnlijk',
  what: 'Wat je kunt doen',
  others: 'Andere mogelijke oorzaken',
  fixTitle: 'Structureel oplossen?',
  fixBody: 'Bereken welke accu, zonnepanelen en laders passen bij hoe jij reist.',
  fixCta: 'Bereken je systeem',
  causes: {
    aging: {
      title: 'De accu is versleten',
      why: 'Een loodaccu (AGM, gel of nat) verliest elk jaar capaciteit, sneller als hij vaak diep ontladen is. Na 4 tot 6 jaar is er soms nog maar de helft over. Hij lijkt vol, maar is na één avond leeg.',
      fix: [
        'Laat de accu een nacht rusten na volledig laden en meet de spanning: onder 12,5 V is hij waarschijnlijk versleten.',
        'Laat een capaciteitstest doen bij een accuspecialist of camperbedrijf.',
        'Vervang je hem? Overweeg dan direct LiFePO4: 90% bruikbaar in plaats van 50%.',
      ],
      link: { href: '/lithium-check', label: 'Kan lithium in jouw camper?' },
    },
    drive: {
      title: 'De accu laadt niet (goed) tijdens het rijden',
      why: 'Bij campers vanaf ongeveer 2015 (Euro 6) verlaagt de motor de dynamospanning tijdens het rijden. Een gewoon scheidingsrelais laadt de woonaccu dan nauwelijks. Een te dunne of lange kabel maakt het erger.',
      fix: [
        'Meet de spanning op de woonaccu met draaiende motor. Onder 13,2 V laadt hij nauwelijks.',
        'Vervang het scheidingsrelais door een DC-DC-lader die op het motorsignaal (D+) schakelt.',
        'Controleer de zekering tussen startaccu en woonaccu. Die is vaak doorgebrand zonder dat iemand het merkt.',
      ],
      link: { href: '/gidsen/dc-dc-lader', label: 'Lees over de DC-DC-lader' },
    },
    idle: {
      title: 'De omvormer verbruikt stroom terwijl hij niets doet',
      why: 'Een omvormer die aan staat, verbruikt ook zonder apparaat 8 tot 30 W. Dat is 200 tot 700 Wh per dag: meer dan een koelkast.',
      fix: [
        'Zet de omvormer alleen aan als je hem gebruikt.',
        'Laad telefoons en laptop via 12V/USB in plaats van 230 V.',
        'Zoek bij vervanging een omvormer met spaar- of zoekstand.',
      ],
    },
    capacity: {
      title: 'Je verbruikt meer dan je accu en laders bijhouden',
      why: 'Een koelkast, verwarming en laptop samen gebruiken al snel 800 Wh per dag. Een loodaccu van 95 Ah levert er bruikbaar maar ongeveer 600. Zonder genoeg zon of rijden loop je elke dag een beetje leeg.',
      fix: [
        'Bereken je dagverbruik per apparaat. Vaak is één apparaat de grote verbruiker.',
        'Een (groter) zonnepaneel of een grotere accu lost het structureel op.',
        'Bereken in de configurator wat je nodig hebt voor jouw reizen.',
      ],
      link: { href: '/configurator', label: 'Bereken je systeem' },
    },
    parasitic: {
      title: 'Sluipverbruik tijdens stilstaan',
      why: 'Ook als alles uit staat, verbruiken het bedieningspaneel, een gasmelder, de accumonitor, alarm of tracker stroom. Een paar honderd milliampère maakt een accu in enkele weken leeg. Een diep ontladen loodaccu raakt blijvend beschadigd.',
      fix: [
        'Zet in de stalling de hoofdschakelaar of accuschakelaar uit.',
        'Laat een klein zonnepaneel of een walstroomlader de accu bijhouden.',
        'Meet met een multimeter in serie hoeveel er loopt als alles uit staat.',
      ],
    },
    lithium: {
      title: 'De lithiumaccu wordt nooit echt vol',
      why: 'Laders zonder lithiumprofiel stoppen te vroeg of druppelladen te lang. De accumonitor raakt dan ook ontregeld: hij zegt 60% terwijl het 30% is.',
      fix: [
        'Controleer of elke lader (walstroom, zon, DC-DC) op LiFePO4 staat: 14,2–14,4\u00a0V, geen druppellading.',
        'Laad één keer volledig tot het BMS de lading stopt, zodat de monitor opnieuw kalibreert.',
        'Kijk in de app van het BMS of alle cellen even ver geladen zijn.',
      ],
      link: { href: '/gidsen/lithium-op-oude-ebl', label: 'Lithium op een oude EBL' },
    },
  },
}

export type AccuCopy = typeof nl

const en: AccuCopy = {
  metaTitle: 'Battery going flat? Find the cause',
  meta: 'Does the leisure battery in your camper keep going flat? Seven questions, the likely causes, and what you can do.',
  eyebrow: 'Diagnosis',
  title: 'Battery keeps going flat?',
  lead: 'Seven questions, no meter required. You get the likely causes in order, and what to do about them.',
  groups: { happens: 'What happens', charge: 'Charging', inverter: 'Inverter' },
  q1: '1. When is the battery flat?',
  when: [
    { value: 'night', label: 'After a single night', detail: 'Even though it looked full' },
    { value: 'days', label: 'After two or three days off grid', detail: 'Without shore power' },
    { value: 'driving', label: 'Even when I drive a lot', detail: 'Driving does not seem to help' },
    { value: 'storage', label: 'After it has stood for a while', detail: 'In storage or at home' },
  ],
  q2: '2. What kind of leisure battery do you have?',
  kind: [
    { value: 'lead', label: 'AGM, gel or flooded', detail: 'Lead-acid, heavy' },
    { value: 'lithium', label: 'Lithium (LiFePO4)' },
    { value: 'unknown', label: 'I don’t know' },
  ],
  q3: '3. How old is the battery?',
  age: [
    { value: 'new', label: 'Up to 3 years' },
    { value: 'mid', label: '3 to 6 years' },
    { value: 'old', label: 'Older than 6 years' },
    { value: 'unknown', label: 'I don’t know' },
  ],
  q4: '4. Does the battery rise after an hour of driving?',
  q4hint: 'Check the control panel or the battery monitor, before and after the drive.',
  drive: [
    { value: 'yes', label: 'Yes, clearly' },
    { value: 'little', label: 'Hardly' },
    { value: 'unknown', label: 'I don’t know' },
  ],
  q5: '5. Year of the base vehicle',
  q5hint: 'It is on the registration document. From 2015 the base vehicle is usually Euro 6, with a smart alternator.',
  year: [
    { value: 'pre2015', label: 'Before 2015' },
    { value: 'post2015', label: '2015 or later' },
    { value: 'unknown', label: 'I don’t know' },
  ],
  q6: '6. Solar on the roof?',
  solar: [
    { value: 'none', label: 'None' },
    { value: 'small', label: 'Up to 150 Wp' },
    { value: 'large', label: 'More than 150 Wp' },
  ],
  q7: '7. Is the inverter (the 230 V socket) often left on?',
  inverter: [
    { value: 'on', label: 'Yes, most of the time' },
    { value: 'off', label: 'Only when I use it' },
    { value: 'none', label: 'No inverter' },
  ],
  submit: 'See the causes',
  done: 'All questions answered.',
  progress: (n, total) => `${n} of ${total} answered`,
  likely: 'Most likely',
  also: 'Also likely',
  possible: 'Possible',
  less: 'Less likely',
  what: 'What you can do',
  others: 'Other possible causes',
  fixTitle: 'Fix it properly?',
  fixBody: 'Work out the battery, solar and chargers that fit how you travel.',
  fixCta: 'Size your system',
  causes: {
    aging: {
      title: 'The battery is worn out',
      why: 'A lead-acid battery (AGM, gel or flooded) loses capacity every year, faster if it is often discharged deeply. After 4 to 6 years sometimes only half is left. It looks full, and it is empty after one evening.',
      fix: [
        'Let it rest overnight after a full charge and measure the voltage: under 12.5 V it is probably worn out.',
        'Have a capacity test done by a battery specialist or a camper workshop.',
        'Replacing it? Consider LiFePO4 straight away: about 90% usable instead of 50%.',
      ],
      link: { href: '/lithium-check', label: 'Can this camper take lithium?' },
    },
    drive: {
      title: 'The battery does not charge properly while you drive',
      why: 'From about 2015 (Euro 6) the engine lowers alternator voltage while you drive. An ordinary split-charge relay then barely charges the leisure battery. A cable that is too thin or too long makes it worse.',
      fix: [
        'Measure the voltage at the leisure battery with the engine running. Under 13.2 V it is barely charging.',
        'Replace the split-charge relay with a DC-DC charger that switches on the engine signal (D+).',
        'Check the fuse between the starter battery and the leisure battery. It is often blown without anyone noticing.',
      ],
      link: { href: '/gidsen/dc-dc-lader', label: 'Read about the DC-DC charger' },
    },
    idle: {
      title: 'The inverter uses power while it does nothing',
      why: 'An inverter that is switched on still draws 8 to 30 W with nothing plugged in. That is 200 to 700 Wh a day: more than a fridge.',
      fix: [
        'Switch the inverter on only when you use it.',
        'Charge phones and the laptop from 12 V or USB instead of 230 V.',
        'When you replace it, look for an inverter with an eco or search mode.',
      ],
    },
    capacity: {
      title: 'You use more than the battery and the chargers can keep up with',
      why: 'A fridge, a heater and a laptop together are quickly 800 Wh a day. A 95 Ah lead-acid battery only gives you about 600 Wh you can use. Without enough sun or driving you slip a little further behind every day.',
      fix: [
        'Add up the daily use of each appliance. Often one of them is the big consumer.',
        'More solar, or a larger battery, fixes it properly.',
        'The configurator works out what your trips need.',
      ],
      link: { href: '/configurator', label: 'Size your system' },
    },
    parasitic: {
      title: 'A parasitic drain while it stands',
      why: 'Even with everything off, the control panel, a gas alarm, the battery monitor, an alarm or a tracker still draw current. A few hundred milliamps empty a battery in a few weeks. A deeply discharged lead-acid battery is damaged for good.',
      fix: [
        'In storage, switch off the main isolator or the battery switch.',
        'Leave a small solar panel or a shore charger to keep the battery topped up.',
        'With a multimeter in series, measure what still flows when everything is off.',
      ],
    },
    lithium: {
      title: 'The lithium battery never really gets full',
      why: 'Chargers without a lithium profile stop too early, or they float for too long. The battery monitor then drifts as well: it says 60% when the battery is at 30%.',
      fix: [
        'Check that every charger (shore, solar, DC-DC) is set to LiFePO4: 14.2–14.4 V, no float.',
        'Charge once all the way until the BMS stops the charge, so the monitor can calibrate.',
        'In the BMS app, check that the cells are at a similar state of charge.',
      ],
      link: { href: '/gidsen/lithium-op-oude-ebl', label: 'Lithium on an old electroblock' },
    },
  },
}

export function accuCopy(locale: Locale): AccuCopy {
  return locale === 'en' ? en : nl
}
