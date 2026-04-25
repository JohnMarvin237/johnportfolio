'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

const BILINGUAL_TYPES = ['bilingual', 'bilingual-textarea', 'bilingual-tags']

export interface FieldDef {
  name: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'tags'
    | 'checkbox'
    | 'number'
    | 'date'
    | 'url'
    | 'email'
    | 'tel'
    | 'bilingual'
    | 'bilingual-textarea'
    | 'bilingual-tags'
  placeholder?: string
  rows?: number
  required?: boolean
  nullable?: boolean
  default?: string | number | boolean
}

export interface AdminFormProps {
  fields: FieldDef[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: Record<string, any>
  apiUrl: string
  redirectUrl: string
  method?: 'POST' | 'PUT' | 'PATCH'
}

interface LangLabelProps {
  lang: 'fr' | 'en'
}

function LangLabel({ lang }: LangLabelProps) {
  const flag = lang === 'fr' ? '🇫🇷' : '🇬🇧'
  const label = lang === 'fr' ? 'Français' : 'English'
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
      {flag} {label}
    </span>
  )
}

interface BilingualInputProps {
  field: FieldDef
  valueFr: string
  valueEn: string
  onChange: (name: string, value: string) => void
  errors: Record<string, string | null | undefined>
}

function BilingualInput({ field, valueFr, valueEn, onChange, errors }: BilingualInputProps) {
  const isTags = field.type === 'bilingual-tags'
  const isTextarea = field.type === 'bilingual-textarea'
  const nameFr = `${field.name}_fr`
  const nameEn = `${field.name}_en`

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm'

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* French */}
        <div>
          <LangLabel lang="fr" />
          {isTextarea ? (
            <textarea
              id={nameFr}
              rows={field.rows || 4}
              value={valueFr}
              onChange={(e) => onChange(nameFr, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
          ) : (
            <input
              id={nameFr}
              type="text"
              value={valueFr}
              onChange={(e) => onChange(nameFr, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
          )}
          {isTags && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Séparez les valeurs par des virgules
            </p>
          )}
          {errors[nameFr] && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[nameFr]}</p>
          )}
        </div>

        {/* English */}
        <div>
          <LangLabel lang="en" />
          {isTextarea ? (
            <textarea
              id={nameEn}
              rows={field.rows || 4}
              value={valueEn}
              onChange={(e) => onChange(nameEn, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
          ) : (
            <input
              id={nameEn}
              type="text"
              value={valueEn}
              onChange={(e) => onChange(nameEn, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
          )}
          {isTags && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Separate values with commas
            </p>
          )}
          {errors[nameEn] && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[nameEn]}</p>
          )}
        </div>
      </div>

      {/* Shared field error (e.g. from Zod on the base field name) */}
      {errors[field.name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field.name]}</p>
      )}
    </div>
  )
}

export default function AdminForm({
  fields,
  initialData,
  apiUrl,
  redirectUrl,
  method = 'POST',
}: AdminFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState<Record<string, string | boolean | number>>(() => {
    const data: Record<string, string | boolean | number> = {}
    fields.forEach((field) => {
      if (BILINGUAL_TYPES.includes(field.type)) {
        const nameFr = `${field.name}_fr`
        const nameEn = `${field.name}_en`

        if (field.type === 'bilingual-tags') {
          // Arrays from DB → comma-separated strings for display
          data[nameFr] = Array.isArray(initialData?.[nameFr])
            ? initialData[nameFr].join(', ')
            : (initialData?.[nameFr] ?? '')
          data[nameEn] = Array.isArray(initialData?.[nameEn])
            ? initialData[nameEn].join(', ')
            : (initialData?.[nameEn] ?? '')
        } else {
          data[nameFr] = initialData?.[nameFr] ?? initialData?.[field.name] ?? ''
          data[nameEn] = initialData?.[nameEn] ?? ''
        }
        return
      }

      if (initialData && initialData[field.name] !== undefined) {
        if (field.type === 'date' && initialData[field.name]) {
          data[field.name] = new Date(initialData[field.name]).toISOString().split('T')[0]
        } else if (field.type === 'tags') {
          data[field.name] = Array.isArray(initialData[field.name])
            ? initialData[field.name].join(', ')
            : ''
        } else {
          data[field.name] = initialData[field.name] ?? field.default ?? ''
        }
      } else {
        data[field.name] = field.default ?? ''
      }
    })
    return data
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const handleChange = (name: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setGlobalError('')
    setErrors({})

    const body: Record<string, unknown> = {}
    fields.forEach((field) => {
      if (BILINGUAL_TYPES.includes(field.type)) {
        const nameFr = `${field.name}_fr`
        const nameEn = `${field.name}_en`

        if (field.type === 'bilingual-tags') {
          // Convert comma-separated strings → arrays
          const toArray = (str: unknown) =>
            str ? String(str).split(',').map((s) => s.trim()).filter(Boolean) : []
          body[nameFr] = toArray(formData[nameFr])
          body[nameEn] = toArray(formData[nameEn])
          // Base field = FR array (backward-compat fallback)
          body[field.name] = (body[nameFr] as string[]).length > 0 ? body[nameFr] : body[nameEn]
        } else {
          body[nameFr] = formData[nameFr] || null
          body[nameEn] = formData[nameEn] || null
          // Base field = FR value (backward-compat fallback)
          body[field.name] = formData[nameFr] || formData[nameEn] || ''
        }
        return
      }

      const value = formData[field.name]
      if (field.type === 'tags') {
        body[field.name] = value
          ? String(value).split(',').map((s) => s.trim()).filter(Boolean)
          : []
      } else if (field.type === 'number') {
        body[field.name] = value === '' ? 0 : Number(value)
      } else if (field.type === 'checkbox') {
        body[field.name] = Boolean(value)
      } else if (field.type === 'date') {
        body[field.name] = value || null
      } else {
        body[field.name] = value || (field.nullable ? null : value)
      }
    })

    try {
      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {}
          data.details.forEach((issue: { path?: string[]; message: string }) => {
            const path = issue.path?.[0]
            if (path) fieldErrors[path] = issue.message
          })
          setErrors(fieldErrors)
        }
        setGlobalError(data.error || 'Une erreur est survenue')
        setSubmitting(false)
        return
      }

      router.push(redirectUrl)
      router.refresh()
    } catch {
      setGlobalError('Erreur réseau')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      {globalError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {globalError}
        </div>
      )}

      {fields.map((field) => {
        // — Bilingual fields —
        if (BILINGUAL_TYPES.includes(field.type)) {
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <BilingualInput
                field={field}
                valueFr={String(formData[`${field.name}_fr`] ?? '')}
                valueEn={String(formData[`${field.name}_en`] ?? '')}
                onChange={handleChange}
                errors={errors}
              />
            </div>
          )
        }

        // — Checkbox —
        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className="flex items-center gap-3">
              <input
                id={field.name}
                type="checkbox"
                checked={!!formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
              />
              <label htmlFor={field.name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
            </div>
          )
        }

        // — All other field types —
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                rows={field.rows || 4}
                value={String(formData[field.name] ?? '')}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            ) : field.type === 'tags' ? (
              <div>
                <input
                  id={field.name}
                  type="text"
                  value={String(formData[field.name] ?? '')}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder || 'Tag1, Tag2, Tag3'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Séparez les valeurs par des virgules
                </p>
              </div>
            ) : (
              <input
                id={field.name}
                type={field.type || 'text'}
                value={String(formData[field.name] ?? '')}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            )}

            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field.name]}</p>
            )}
          </div>
        )
      })}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(redirectUrl)}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
