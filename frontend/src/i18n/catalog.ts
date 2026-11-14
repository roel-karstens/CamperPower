import { DEVICES, PROFILES, type DrivingPattern, type HookupPattern } from '../data/devices'
import type { Locale } from './locale'

type DeviceId = (typeof DEVICES)[number]['id']
type ProfileId = (typeof PROFILES)[number]['id']

const DEVICE_EN: Record<DeviceId, { name: string; hint: string }> = {
  fridge: {
    name: 'Compressor fridge',
    hint: 'The compressor runs about half the time. In summer, often more.',
  },
  lights: { name: 'LED lights', hint: 'Four to six spots together.' },
  phones: { name: 'Phone charging', hint: 'Two phones over USB.' },
  pump: { name: 'Water pump', hint: 'Only runs while a tap is open.' },
  laptop: { name: 'Laptop', hint: 'Through the inverter. A 12 V charger saves about 15%.' },
  heater: { name: 'Diesel heater', hint: 'Fan and pump. Startup can briefly pull 100 W or more.' },
  fan: { name: 'Roof vent', hint: 'For example a Maxxfan on a medium speed.' },
  tv: { name: 'TV or projector', hint: 'A 12 V TV. A 230 V set costs more.' },
  starlink: { name: 'Starlink Mini', hint: 'About 25–40 W, straight off 12 V.' },
  cpap: { name: 'CPAP machine', hint: 'Without the humidifier. With one, sometimes twice the power.' },
  ebike: { name: 'E-bike charging', hint: 'About half a battery a day.' },
  coffee: { name: 'Coffee machine', hint: 'Short but heavy: it needs a sturdy inverter.' },
  hairdryer: { name: 'Hairdryer', hint: 'A travel dryer on low. A household dryer pulls 2000 W.' },
  induction: { name: 'Induction hob', hint: 'A single ring, half an hour a day.' },
}

const PROFILE_EN: Record<ProfileId, { name: string; summary: string }> = {
  weekend: { name: 'Weekends away', summary: 'Two nights, fridge, lights, phones.' },
  tour: { name: 'Touring Europe', summary: 'Moving on every few days, a campsite now and then.' },
  offgrid: { name: 'Off grid', summary: 'Days in one place, with no hook-up.' },
  work: { name: 'Working on the road', summary: 'Laptop and internet, including spring and autumn.' },
}

const DRIVING_EN: Record<DrivingPattern, { label: string; detail: string }> = {
  rarely: { label: 'Often parked for days', detail: 'About fifteen minutes of driving a day' },
  sometimes: { label: 'Moving on every few days', detail: 'About half an hour of driving a day' },
  daily: { label: 'On the road most days', detail: 'About an hour and a half of driving a day' },
}

const HOOKUP_EN: Record<HookupPattern, { label: string; detail: string }> = {
  never: { label: 'No shore power', detail: 'Camper stops and off-grid pitches' },
  sometimes: { label: 'A campsite now and then', detail: 'About one night in three' },
  mostly: { label: 'Mostly on a campsite', detail: 'Solar is mainly a buffer' },
}

const GROUP_EN = {
  basis: 'Basics',
  comfort: 'Comfort',
  zwaar: 'Heavy 230 V kit',
} as const

export function deviceText(id: DeviceId, locale: Locale, dutch: { name: string; hint: string }) {
  return locale === 'en' ? DEVICE_EN[id] : dutch
}

export function profileText(id: ProfileId, locale: Locale, dutch: { name: string; summary: string }) {
  return locale === 'en' ? PROFILE_EN[id] : dutch
}

export function drivingText(id: DrivingPattern, locale: Locale, dutch: { label: string; detail: string }) {
  return locale === 'en' ? DRIVING_EN[id] : dutch
}

export function hookupText(id: HookupPattern, locale: Locale, dutch: { label: string; detail: string }) {
  return locale === 'en' ? HOOKUP_EN[id] : dutch
}

export function groupTitle(id: 'basis' | 'comfort' | 'zwaar', locale: Locale, dutch: string) {
  return locale === 'en' ? GROUP_EN[id] : dutch
}
