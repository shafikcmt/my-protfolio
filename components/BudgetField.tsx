'use client'

import { useState } from 'react'
import { Check, PenLine } from 'lucide-react'

/**
 * Budget picker used by every enquiry / order form.
 * Preset ranges start at $800 (typical custom project size); clients with a
 * different budget can type their own amount in any currency.
 */
export const BUDGET_PRESETS = ['$800 – $1,500', '$1,500 – $3,000', '$3,000 – $6,000', '$6,000+', 'Not sure yet — let’s discuss']

export const BUDGET_MAX_LENGTH = 80

interface BudgetFieldProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  /** Hide the label when the form renders its own. */
  hideLabel?: boolean
}

export default function BudgetField({ id = 'budget', label = 'Budget', value, onChange, hideLabel }: BudgetFieldProps) {
  const isPreset = BUDGET_PRESETS.includes(value)
  const [custom, setCustom] = useState(Boolean(value) && !isPreset)
  const showCustom = custom || (Boolean(value) && !isPreset)

  const pick = (preset: string) => {
    setCustom(false)
    onChange(value === preset ? '' : preset)
  }

  const chooseCustom = () => {
    setCustom(true)
    if (isPreset) onChange('')
  }

  const chip = (selected: boolean) =>
    `inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
      selected
        ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/15'
        : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700'
    }`

  return (
    <div>
      {!hideLabel && (
        <p id={`${id}-label`} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label} <span className="font-normal text-slate-400">(USD)</span>
        </p>
      )}
      <div role="radiogroup" aria-labelledby={hideLabel ? undefined : `${id}-label`} aria-label={hideLabel ? label : undefined} className="flex flex-wrap gap-2">
        {BUDGET_PRESETS.map((preset) => {
          const selected = value === preset && !showCustom
          return (
            <button key={preset} type="button" role="radio" aria-checked={selected} onClick={() => pick(preset)} className={chip(selected)}>
              {selected && <Check className="h-3.5 w-3.5" />}
              {preset}
            </button>
          )
        })}
        <button type="button" role="radio" aria-checked={showCustom} onClick={chooseCustom} className={chip(showCustom)}>
          <PenLine className="h-3.5 w-3.5" /> Type my own
        </button>
      </div>

      {showCustom && (
        <input
          id={id}
          type="text"
          autoFocus={custom && !value}
          value={value}
          maxLength={BUDGET_MAX_LENGTH}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. $500, $2,000 or 60,000 BDT"
          className="input-field mt-2.5"
        />
      )}
      <p className="mt-1.5 text-xs text-slate-500">
        Most custom web apps start from $800. Different budget? Choose “Type my own” — I’ll suggest the best option for it.
      </p>
    </div>
  )
}
