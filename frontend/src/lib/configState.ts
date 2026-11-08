import { DEVICES, DRIVING_OPTIONS, HOOKUP_OPTIONS, PROFILES, defaultDevices, type DeviceState } from '../data/devices'
import type { BatteryType, Inputs, TriState } from './calc'

export interface ConfigState extends Inputs {
  profile: string
}

const STORAGE_KEY = 'camperpower.config.v2'

export function initialState(profileId = 'tour'): ConfigState {
  const p = PROFILES.find((x) => x.id === profileId) ?? PROFILES[1]
  return {
    profile: p.id,
    devices: defaultDevices(p.devices),
    months: [...p.months],
    reserveDays: p.reserveDays,
    driving: p.driving,
    hookup: p.hookup,
    roofWp: 400,
    existingBattery: 'agm',
    existingAh: 95,
    ebl: 'unknown',
    euro6: 'unknown',
    starterCableM: 5,
  }
}

function clamp(n: unknown, min: number, max: number, fallback: number): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : fallback
  return Math.min(max, Math.max(min, v))
}

function oneOf<T extends string>(v: unknown, options: readonly T[], fallback: T): T {
  return options.includes(v as T) ? (v as T) : fallback
}

/** Validate untrusted input (URL or localStorage) into a safe ConfigState. */
export function sanitize(raw: unknown): ConfigState {
  const base = initialState()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Record<string, unknown>
  const devices: DeviceState = { ...base.devices }
  const rd = (r.devices && typeof r.devices === 'object' ? r.devices : {}) as Record<string, unknown>
  for (const d of DEVICES) {
    const u = rd[d.id] as Record<string, unknown> | undefined
    if (!u || typeof u !== 'object') continue
    devices[d.id] = {
      on: u.on === true,
      watts: clamp(u.watts, 1, 3000, d.watts),
      hours: clamp(u.hours, 0, 24, d.hours),
    }
  }
  const months = Array.isArray(r.months)
    ? [...new Set(r.months.filter((m): m is number => Number.isInteger(m) && m >= 0 && m <= 11))].sort((a, b) => a - b)
    : base.months
  return {
    profile: oneOf(r.profile, [...PROFILES.map((p) => p.id), 'custom'], base.profile),
    devices,
    months: months.length ? months : base.months,
    reserveDays: Math.round(clamp(r.reserveDays, 1, 5, base.reserveDays)),
    driving: oneOf(r.driving, Object.keys(DRIVING_OPTIONS) as (keyof typeof DRIVING_OPTIONS)[], base.driving),
    hookup: oneOf(r.hookup, Object.keys(HOOKUP_OPTIONS) as (keyof typeof HOOKUP_OPTIONS)[], base.hookup),
    roofWp: clamp(r.roofWp, 100, 1000, base.roofWp),
    existingBattery: oneOf<BatteryType>(r.existingBattery, ['none', 'agm', 'lifepo4'], base.existingBattery),
    existingAh: clamp(r.existingAh, 0, 1000, base.existingAh),
    ebl: oneOf<TriState>(r.ebl, ['yes', 'no', 'unknown'], base.ebl),
    euro6: oneOf<TriState>(r.euro6, ['yes', 'no', 'unknown'], base.euro6),
    starterCableM: clamp(r.starterCableM, 0.5, 15, base.starterCableM),
  }
}

/** Compact share encoding: only enabled devices and changed values. */
export function encodeShare(s: ConfigState): string {
  const devices: Record<string, { on: boolean; watts: number; hours: number }> = {}
  for (const d of DEVICES) {
    const u = s.devices[d.id]
    if (u.on || u.watts !== d.watts || u.hours !== d.hours) devices[d.id] = u
  }
  const json = JSON.stringify({ ...s, devices })
  const binary = Array.from(new TextEncoder().encode(json), (b) => String.fromCharCode(b)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShare(code: string): ConfigState | null {
  if (code.length > 4000) return null
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
    const json = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)))
    const parsed: unknown = JSON.parse(json)
    if (!parsed || typeof parsed !== 'object') return null
    // Devices not in the share were off.
    const p = parsed as Record<string, unknown>
    const shared = (p.devices ?? {}) as Record<string, unknown>
    const devices = Object.fromEntries(
      DEVICES.map((d) => [d.id, shared[d.id] ?? { on: false, watts: d.watts, hours: d.hours }]),
    )
    return sanitize({ ...p, devices })
  } catch {
    return null
  }
}

export function loadStored(): ConfigState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitize(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function store(s: ConfigState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    // Storage full or blocked: the configurator still works for this visit.
  }
}

export function clearStored() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
