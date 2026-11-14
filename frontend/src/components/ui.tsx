import { useId, type ReactNode } from 'react'
import { chrome } from '../i18n/chrome'
import type { Check } from '../lib/calc'
import { Link } from '../lib/router'
import { useRouter } from '../lib/useRouter'

interface Option<T extends string> {
  value: T
  label: string
  detail?: string
}

export function ChoiceCards<T extends string>({
  legend,
  hint,
  options,
  value,
  onChange,
  columns = 3,
}: {
  legend: string
  hint?: string
  options: readonly Option<T>[]
  value: T
  onChange: (v: T) => void
  columns?: 2 | 3 | 4
}) {
  const name = useId()
  return (
    <fieldset className="field">
      <legend className="field-label">{legend}</legend>
      {hint && <p className="field-hint">{hint}</p>}
      <div className={`choice-grid cols-${columns}`}>
        {options.map((o) => (
          <label key={o.value} className="choice">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="choice-body">
              <span className="choice-title">{o.label}</span>
              {o.detail && <span className="choice-detail">{o.detail}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Segmented<T extends string | number>({
  legend,
  hint,
  options,
  value,
  onChange,
}: {
  legend: string
  hint?: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  const name = useId()
  return (
    <fieldset className="field">
      <legend className="field-label">{legend}</legend>
      {hint && <p className="field-hint">{hint}</p>}
      <div className="segmented">
        {options.map((o) => (
          <label key={String(o.value)}>
            <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function NumberStepper({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  compact,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  unit: string
  compact?: boolean
}) {
  const id = useId()
  const { locale } = useRouter()
  const t = chrome(locale)
  const set = (v: number) => onChange(Math.min(max, Math.max(min, Math.round(v / step) * step)))
  return (
    <div className={`stepper ${compact ? 'stepper-compact' : ''}`}>
      <label htmlFor={id} className={compact ? 'sr-only' : 'field-label'}>
        {label}
      </label>
      <div className="stepper-control">
        <button type="button" onClick={() => set(value - step)} disabled={value <= min} aria-label={`${label} ${t.decrease}`}>
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)))
          }}
        />
        <span className="stepper-unit" aria-hidden="true">
          {unit}
        </span>
        <button type="button" onClick={() => set(value + step)} disabled={value >= max} aria-label={`${label} ${t.increase}`}>
          +
        </button>
      </div>
    </div>
  )
}

export function CheckItem({ check }: { check: Check }) {
  const { locale } = useRouter()
  const level = chrome(locale).levels[check.level]
  return (
    <div className={`check check-${check.level}`}>
      <span className="check-level">{level}</span>
      <h3 className="check-title">{check.title}</h3>
      <p>{check.body}</p>
      {check.link && (
        <Link href={check.link.href} className="text-link">
          {check.link.label} →
        </Link>
      )}
    </div>
  )
}

export function Callout({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return <aside className={`callout callout-${tone}`}>{children}</aside>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}
