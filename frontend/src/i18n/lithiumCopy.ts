import type { Locale } from './locale'

type Light = 'ok' | 'fix' | 'stop'

interface Option {
  value: string
  label: string
  light: Light
  advice: string
}

interface Item {
  id: string
  question: string
  hint?: string
  options: Option[]
}

const nl = {
  metaTitle: 'Lithium-check: kan LiFePO4 in jouw camper?',
  meta: 'Controleer in zeven vragen of je laders, dynamo en installatie klaar zijn voor een LiFePO4-accu. Met een actielijst per punt.',
  eyebrow: 'Check',
  title: 'Kan lithium in jouw camper?',
  lead: 'Een LiFePO4-accu is lichter en gaat langer mee. Maar je laders moeten er wel bij passen. Zeven korte vragen, daarna eerst wat je moet oplossen.',
  submit: 'Bekijk de actielijst',
  done: 'Alle vragen beantwoord.',
  progress: (n: number, total: number) => `${n} van ${total} beantwoord`,
  lights: { ok: 'In orde', fix: 'Aanpassen', stop: 'Eerst oplossen' },
  ready: 'Je camper is klaar voor lithium',
  withFixes: (n: number) => `Lithium kan, met ${n} ${n === 1 ? 'aanpassing' : 'aanpassingen'}`,
  blocked: 'Los eerst dit op voor je lithium aansluit',
  already: 'Al in orde',
  sizeTitle: 'Welke maat accu en laders?',
  sizeBody: 'De configurator houdt rekening met je huidige accu, EBL en dynamo, en geeft een stuklijst.',
  sizeCta: 'Bereken je systeem',
  items: [
    {
      id: 'mix',
      question: 'Blijft er een loodaccu (AGM, gel) als woonaccu naast de lithium?',
      options: [
        { value: 'no', label: 'Nee, ik vervang hem', light: 'ok', advice: 'Goed. Eén accutype per accupakket.' },
        { value: 'yes', label: 'Ja, ze komen naast elkaar', light: 'stop', advice: 'Niet doen. Lood en lithium parallel laden en ontladen verschillend. De loodaccu wordt overladen of de lithium nooit vol.' },
      ],
    },
    {
      id: 'shore',
      question: 'Heeft je walstroomlader of EBL een LiFePO4-stand?',
      hint: 'Kijk op het typeplaatje en zoek de handleiding op.',
      options: [
        { value: 'yes', label: 'Ja', light: 'ok', advice: 'Zet hem op LiFePO4 en controleer de laadspanning: 14,2 tot 14,4 V.' },
        { value: 'no', label: 'Nee', light: 'fix', advice: 'Schakel de interne lader uit en plaats een losse lader met LiFePO4-profiel.' },
        { value: 'unknown', label: 'Weet ik niet', light: 'fix', advice: 'Zoek het type op. Bij twijfel: vraag het de fabrikant voor je de accu aansluit.' },
      ],
    },
    {
      id: 'drive',
      question: 'Hoe laadt de woonaccu tijdens het rijden?',
      options: [
        { value: 'dcdc', label: 'Via een DC-DC-lader', light: 'ok', advice: 'Goed. Zet hem op LiFePO4 en controleer of hij op het motorsignaal (D+) schakelt.' },
        { value: 'relay', label: 'Via relais of EBL', light: 'fix', advice: 'Lithium trekt te veel stroom uit de dynamo. Plaats een DC-DC-lader van 20 tot 30% van de accucapaciteit.' },
        { value: 'unknown', label: 'Weet ik niet', light: 'fix', advice: 'Volg de kabel vanaf de startaccu. Zit er geen DC-DC-lader tussen, dan is dat waarschijnlijk nodig.' },
      ],
    },
    {
      id: 'solar',
      question: 'Heeft je zonneregelaar een LiFePO4-stand?',
      options: [
        { value: 'yes', label: 'Ja', light: 'ok', advice: 'Zet hem op LiFePO4 en zet druppelladen (float) laag of uit.' },
        { value: 'no', label: 'Nee', light: 'fix', advice: 'Vervang de regelaar door een MPPT-regelaar met instelbaar profiel.' },
        { value: 'none', label: 'Geen zonnepaneel', light: 'ok', advice: 'Niets te doen.' },
      ],
    },
    {
      id: 'cold',
      question: 'Waar komt de accu te staan?',
      hint: 'LiFePO4 mag niet laden onder 0 °C.',
      options: [
        { value: 'inside', label: 'Binnen, in de woonruimte', light: 'ok', advice: 'Goed. Daar wordt het bij gebruik zelden kouder dan 0 °C.' },
        { value: 'outside', label: 'Buiten of onder de vloer', light: 'fix', advice: 'Kies een accu met ingebouwde verwarming of een BMS dat laden onder 0 °C blokkeert.' },
      ],
    },
    {
      id: 'fuse',
      question: 'Zit er een hoofdzekering vlak bij de accu?',
      options: [
        { value: 'yes', label: 'Ja', light: 'ok', advice: 'Controleer of hij past bij de dikste kabel en binnen 20 cm van de pluspool zit.' },
        { value: 'no', label: 'Nee', light: 'stop', advice: 'Plaats een hoofdzekering (bijvoorbeeld MEGA of ANL) direct bij de pluspool. Een lithiumaccu kan duizenden ampères leveren.' },
        { value: 'unknown', label: 'Weet ik niet', light: 'fix', advice: 'Controleer het voor je gaat rijden.' },
      ],
    },
    {
      id: 'monitor',
      question: 'Heb je een accumonitor met shunt, of een BMS met app?',
      hint: 'Lithium houdt de spanning lang gelijk. Aan de spanning zie je niet hoe vol hij is.',
      options: [
        { value: 'yes', label: 'Ja', light: 'ok', advice: 'Goed. Stel de capaciteit in op die van de nieuwe accu.' },
        { value: 'no', label: 'Nee', light: 'fix', advice: 'Kies een accu met Bluetooth-BMS of plaats een shunt. Anders weet je niet hoeveel er nog in zit.' },
      ],
    },
  ] satisfies Item[],
}

type LithiumCopy = typeof nl

const en: LithiumCopy = {
  metaTitle: 'Lithium check: will LiFePO4 fit your camper?',
  meta: 'Seven questions on whether your chargers, alternator and wiring are ready for a LiFePO4 battery, with an action for each point.',
  eyebrow: 'Check',
  title: 'Can this camper take lithium?',
  lead: 'A LiFePO4 battery is lighter and lasts longer. The chargers still have to match it. Seven short questions, then the things you have to sort out first.',
  submit: 'See the action list',
  done: 'All questions answered.',
  progress: (n, total) => `${n} of ${total} answered`,
  lights: { ok: 'Fine', fix: 'Change this', stop: 'Sort this out first' },
  ready: 'This camper is ready for lithium',
  withFixes: (n) => `Lithium can work, with ${n} ${n === 1 ? 'change' : 'changes'}`,
  blocked: 'Sort this out before you connect lithium',
  already: 'Already fine',
  sizeTitle: 'What size of battery and chargers?',
  sizeBody: 'The configurator takes your current battery, electroblock and alternator into account, and gives you a parts list.',
  sizeCta: 'Size your system',
  items: [
    {
      id: 'mix',
      question: 'Will a lead-acid battery (AGM, gel) stay in the bank next to the lithium?',
      options: [
        { value: 'no', label: 'No, I am replacing it', light: 'ok', advice: 'Good. One battery chemistry per bank.' },
        { value: 'yes', label: 'Yes, they will sit side by side', light: 'stop', advice: 'Don’t. Lead-acid and lithium charge and discharge differently in parallel. The lead-acid battery gets overcharged, or the lithium never fills.' },
      ],
    },
    {
      id: 'shore',
      question: 'Does the shore charger or electroblock have a LiFePO4 setting?',
      hint: 'Look at the rating plate and find the manual.',
      options: [
        { value: 'yes', label: 'Yes', light: 'ok', advice: 'Set it to LiFePO4 and check the charge voltage: 14.2 to 14.4 V.' },
        { value: 'no', label: 'No', light: 'fix', advice: 'Switch the internal charger off and fit a separate charger with a LiFePO4 profile.' },
        { value: 'unknown', label: 'I don’t know', light: 'fix', advice: 'Look up the model. If you are unsure, ask the maker before you connect the battery.' },
      ],
    },
    {
      id: 'drive',
      question: 'How does the leisure battery charge while you drive?',
      options: [
        { value: 'dcdc', label: 'Through a DC-DC charger', light: 'ok', advice: 'Good. Set it to LiFePO4 and check that it switches on the engine signal (D+).' },
        { value: 'relay', label: 'Through a relay or the electroblock', light: 'fix', advice: 'Lithium pulls too much current from the alternator. Fit a DC-DC charger at 20 to 30% of the battery capacity.' },
        { value: 'unknown', label: 'I don’t know', light: 'fix', advice: 'Follow the cable from the starter battery. If there is no DC-DC charger in between, you probably need one.' },
      ],
    },
    {
      id: 'solar',
      question: 'Does the solar controller have a LiFePO4 setting?',
      options: [
        { value: 'yes', label: 'Yes', light: 'ok', advice: 'Set it to LiFePO4 and turn float down or off.' },
        { value: 'no', label: 'No', light: 'fix', advice: 'Replace the controller with an MPPT that has an adjustable profile.' },
        { value: 'none', label: 'No solar panel', light: 'ok', advice: 'Nothing to do.' },
      ],
    },
    {
      id: 'cold',
      question: 'Where will the battery live?',
      hint: 'LiFePO4 must not be charged below 0 °C.',
      options: [
        { value: 'inside', label: 'Inside, in the living space', light: 'ok', advice: 'Good. With the van in use it rarely gets colder than 0 °C there.' },
        { value: 'outside', label: 'Outside, or under the floor', light: 'fix', advice: 'Choose a battery with a built-in heater, or a BMS that blocks charging below 0 °C.' },
      ],
    },
    {
      id: 'fuse',
      question: 'Is there a main fuse right next to the battery?',
      options: [
        { value: 'yes', label: 'Yes', light: 'ok', advice: 'Check that it matches the thickest cable and sits within 20 cm of the positive post.' },
        { value: 'no', label: 'No', light: 'stop', advice: 'Fit a main fuse (for example MEGA or ANL) right at the positive post. A lithium battery can deliver thousands of amps.' },
        { value: 'unknown', label: 'I don’t know', light: 'fix', advice: 'Check before you drive.' },
      ],
    },
    {
      id: 'monitor',
      question: 'Do you have a battery monitor with a shunt, or a BMS with an app?',
      hint: 'Lithium holds its voltage for a long time. Voltage does not tell you how full it is.',
      options: [
        { value: 'yes', label: 'Yes', light: 'ok', advice: 'Good. Set the capacity to that of the new battery.' },
        { value: 'no', label: 'No', light: 'fix', advice: 'Choose a battery with a Bluetooth BMS, or fit a shunt. Otherwise you cannot see what is left.' },
      ],
    },
  ],
}

export function lithiumCopy(locale: Locale): LithiumCopy {
  return locale === 'en' ? en : nl
}
