'use client'

import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useTranslation } from '@/lib/i18n/LanguageContext'

/**
 * Formulaire de contact
 * @param {object} props
 * @param {string} [props.contactEmail]
 */
export default function ContactForm({ contactEmail = '' }) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t('contactForm.nameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contactForm.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contactForm.emailInvalid')
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contactForm.messageRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: t('contactForm.success')
        })
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || t('contactForm.error')
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('contactForm.networkError')
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
        <div className="sm:col-span-2">
          <Input
            label={t('contactForm.name')}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder={t('contactForm.namePlaceholder')}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label={t('contactForm.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder={t('contactForm.emailPlaceholder')}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label={t('contactForm.subject')}
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            placeholder={t('contactForm.subjectPlaceholder')}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label={t('contactForm.message')}
            type="textarea"
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            required
            rows={6}
            placeholder={t('contactForm.messagePlaceholder')}
          />
        </div>
      </div>

      {/* Message de statut */}
      {submitStatus && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
              : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
          }`}
        >
          <p className="text-sm font-medium">{submitStatus.message}</p>
        </div>
      )}

      {/* Bouton de soumission */}
      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? t('contactForm.submitting') : t('contactForm.submit')}
        </Button>
      </div>

      {/* Informations de contact alternatives */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {t('contactForm.altContact')}{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {contactEmail}
          </a>
        </p>
      </div>
    </form>
  )
}
