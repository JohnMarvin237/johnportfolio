'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface SettingFieldDef {
  key: string
  label: string
  type: 'text' | 'email' | 'tel' | 'url'
  placeholder?: string
}

interface SectionDef {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  fields: SettingFieldDef[]
}

export interface SettingsFormProps {
  initialSettings?: Record<string, string>
}

const SECTIONS: SectionDef[] = [
  {
    id: 'contact',
    title: 'Informations de contact',
    description: 'Ces informations apparaissent sur la page Contact.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    fields: [
      { key: 'contact_email', label: 'Adresse e-mail', type: 'email', placeholder: 'vous@exemple.com' },
      { key: 'contact_phone', label: 'Téléphone (optionnel)', type: 'tel', placeholder: '+1 (555) 000-0000' },
      { key: 'contact_location', label: 'Localisation', type: 'text', placeholder: 'Ottawa-Gatineau, Canada' },
    ],
  },
  {
    id: 'social',
    title: 'Réseaux sociaux & profils',
    description: 'Les liens affichés dans la page Contact et sur le site.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    fields: [
      { key: 'social_github', label: 'GitHub', type: 'url', placeholder: 'https://github.com/votrenom' },
      { key: 'social_linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/in/votrenom' },
      { key: 'social_twitter', label: 'Twitter / X (optionnel)', type: 'url', placeholder: 'https://twitter.com/votrenom' },
      { key: 'social_website', label: 'Site personnel (optionnel)', type: 'url', placeholder: 'https://votresite.com' },
    ],
  },
  {
    id: 'profile',
    title: 'Profil & identité',
    description: 'Informations affichées dans le hero, le menu et la page À propos.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    fields: [
      { key: 'profile_name', label: 'Nom complet', type: 'text', placeholder: 'John Doe' },
      { key: 'profile_title', label: 'Titre / Poste', type: 'text', placeholder: 'Développeur Full-Stack' },
      { key: 'profile_tagline', label: 'Accroche (optionnel)', type: 'text', placeholder: 'Passionné par le web et l\'IA' },
    ],
  },
]

const inputClass =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm'

export default function SettingsForm({ initialSettings = {} }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSection = async (section: SectionDef) => {
    setSaving(true)
    setError('')
    setSavedSection(null)

    const payload: Record<string, string> = {}
    section.fields.forEach(({ key }) => {
      if (values[key] !== undefined && values[key] !== '') {
        payload[key] = values[key]
      } else if (values[key] === '') {
        // Allow clearing a value by sending empty string
        payload[key] = ''
      }
    })

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue')
      } else {
        setSavedSection(section.id)
        setTimeout(() => setSavedSection(null), 3000)
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setError('')
    setSavedSection(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue')
      } else {
        setSavedSection('all')
        setTimeout(() => setSavedSection(null), 3000)
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {savedSection === 'all' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
          Tous les paramètres ont été enregistrés.
        </div>
      )}

      {SECTIONS.map((section) => (
        <div
          key={section.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Section header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-start gap-3">
            <div className="mt-0.5 text-primary-600 dark:text-primary-400">{section.icon}</div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{section.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{section.description}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="px-6 py-5 space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  value={values[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Section footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <Button
              onClick={() => handleSaveSection(section)}
              disabled={saving}
              size="sm"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer cette section'}
            </Button>
            {savedSection === section.id && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enregistré
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Save all */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSaveAll} disabled={saving} variant="primary">
          {saving ? 'Enregistrement...' : 'Tout enregistrer'}
        </Button>
      </div>
    </div>
  )
}
