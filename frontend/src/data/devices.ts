export type Supply = 'dc' | 'ac'

export interface DeviceDef {
  id: string
  name: string
  /** Average power while in use, in watts. */
  watts: number
  /** Typical hours of use per day. */
  hours: number
  supply: Supply
  hint: string
  group: 'basis' | 'comfort' | 'zwaar'
}

export const DEVICES: readonly DeviceDef[] = [
  {
    id: 'fridge',
    name: 'Compressorkoelkast',
    watts: 40,
    hours: 12,
    supply: 'dc',
    hint: 'De compressor draait ongeveer de helft van de tijd. In de zomer vaak meer.',
    group: 'basis',
  },
  { id: 'lights', name: 'LED-verlichting', watts: 10, hours: 5, supply: 'dc', hint: 'Vier tot zes spotjes samen.', group: 'basis' },
  { id: 'phones', name: 'Telefoons opladen', watts: 10, hours: 3, supply: 'dc', hint: 'Twee telefoons via USB.', group: 'basis' },
  { id: 'pump', name: 'Waterpomp', watts: 50, hours: 0.5, supply: 'dc', hint: 'Draait alleen als de kraan open staat.', group: 'basis' },
  { id: 'laptop', name: 'Laptop', watts: 60, hours: 3, supply: 'ac', hint: 'Via de omvormer. Met een 12V-lader bespaar je ongeveer 15%.', group: 'comfort' },
  { id: 'heater', name: 'Dieselkachel', watts: 25, hours: 8, supply: 'dc', hint: 'Ventilator en pomp. Bij het opstarten kort 100 W of meer.', group: 'comfort' },
  { id: 'fan', name: 'Dakventilator', watts: 20, hours: 6, supply: 'dc', hint: 'Bijvoorbeeld een Maxxfan op middenstand.', group: 'comfort' },
  { id: 'tv', name: 'TV of beamer', watts: 40, hours: 2, supply: 'dc', hint: '12V-tv. Een 230V-tv kost meer.', group: 'comfort' },
  { id: 'starlink', name: 'Starlink Mini', watts: 30, hours: 6, supply: 'dc', hint: 'Gemiddeld 25–40 W, direct op 12 V.', group: 'comfort' },
  { id: 'cpap', name: 'CPAP-apparaat', watts: 40, hours: 8, supply: 'dc', hint: 'Zonder bevochtiger. Met bevochtiger soms het dubbele.', group: 'comfort' },
  { id: 'ebike', name: 'E-bike laden', watts: 100, hours: 2, supply: 'ac', hint: 'Ongeveer een halve accu per dag.', group: 'zwaar' },
  { id: 'coffee', name: 'Koffiezetapparaat', watts: 1000, hours: 0.15, supply: 'ac', hint: 'Kort maar fors: vraagt een stevige omvormer.', group: 'zwaar' },
  { id: 'hairdryer', name: 'Föhn', watts: 1000, hours: 0.1, supply: 'ac', hint: 'Reisföhn op lage stand. Een gewone föhn trekt 2000 W.', group: 'zwaar' },
  { id: 'induction', name: 'Inductiekookplaat', watts: 1500, hours: 0.5, supply: 'ac', hint: 'Een kookplaat met één pit, een half uur per dag.', group: 'zwaar' },
]

export interface DeviceUse {
  on: boolean
  watts: number
  hours: number
}

export type DeviceState = Record<string, DeviceUse>

export function defaultDevices(enabled: readonly string[]): DeviceState {
  return Object.fromEntries(DEVICES.map((d) => [d.id, { on: enabled.includes(d.id), watts: d.watts, hours: d.hours }]))
}

export interface Profile {
  id: string
  name: string
  summary: string
  devices: string[]
  months: number[]
  reserveDays: number
  driving: DrivingPattern
  hookup: HookupPattern
}

export type DrivingPattern = 'rarely' | 'sometimes' | 'daily'
export type HookupPattern = 'never' | 'sometimes' | 'mostly'

export const PROFILES: readonly Profile[] = [
  {
    id: 'weekend',
    name: 'Weekendjes weg',
    summary: 'Twee nachten, koelkast, licht, telefoon.',
    devices: ['fridge', 'lights', 'phones', 'pump'],
    months: [3, 4, 5, 6, 7, 8],
    reserveDays: 2,
    driving: 'sometimes',
    hookup: 'sometimes',
  },
  {
    id: 'tour',
    name: 'Rondreis door Europa',
    summary: 'Elke paar dagen verder, af en toe een camping.',
    devices: ['fridge', 'lights', 'phones', 'pump', 'laptop', 'fan'],
    months: [4, 5, 6, 7, 8],
    reserveDays: 2,
    driving: 'daily',
    hookup: 'sometimes',
  },
  {
    id: 'offgrid',
    name: 'Vrij staan',
    summary: 'Dagen achtereen zonder walstroom op één plek.',
    devices: ['fridge', 'lights', 'phones', 'pump', 'laptop', 'fan', 'coffee'],
    months: [4, 5, 6, 7, 8],
    reserveDays: 3,
    driving: 'rarely',
    hookup: 'never',
  },
  {
    id: 'work',
    name: 'Werken onderweg',
    summary: 'Laptop en internet, ook in het voor- en najaar.',
    devices: ['fridge', 'lights', 'phones', 'pump', 'laptop', 'starlink', 'heater'],
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    reserveDays: 2,
    driving: 'sometimes',
    hookup: 'sometimes',
  },
]

export const DRIVING_OPTIONS: Record<DrivingPattern, { label: string; detail: string; hoursPerDay: number }> = {
  rarely: { label: 'Ik sta vaak dagen stil', detail: 'Gemiddeld een kwartier rijden per dag', hoursPerDay: 0.25 },
  sometimes: { label: 'Om de paar dagen verder', detail: 'Gemiddeld een half uur rijden per dag', hoursPerDay: 0.5 },
  daily: { label: 'Bijna elke dag onderweg', detail: 'Gemiddeld anderhalf uur rijden per dag', hoursPerDay: 1.5 },
}

export const HOOKUP_OPTIONS: Record<HookupPattern, { label: string; detail: string; share: number }> = {
  never: { label: 'Nooit walstroom', detail: 'Camperplaatsen en vrij staan', share: 0 },
  sometimes: { label: 'Soms op een camping', detail: 'Ongeveer een op de drie nachten', share: 0.3 },
  mostly: { label: 'Meestal op een camping', detail: 'Zon is vooral een buffer', share: 0.7 },
}
