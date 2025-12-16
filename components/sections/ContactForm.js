'use client'

import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

/**
 * Formulaire de contact
 */
export default function ContactForm() {
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
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis'
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
          message: 'Votre message a été envoyé avec succès !'
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
          message: data.error || 'Une erreur est survenue. Veuillez réessayer.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Impossible d\'envoyer le message. Veuillez réessayer plus tard.'
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
            label="Nom complet"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Sujet"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            placeholder="Opportunité de collaboration"
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Message"
            type="textarea"
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            required
            rows={6}
            placeholder="Bonjour, j'aimerais discuter d'une opportunité..."
          />
        </div>
      </div>

      {/* Message de statut */}
      {submitStatus && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
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
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </Button>
      </div>

      {/* Informations de contact alternatives */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Vous pouvez également me contacter directement par email à{' '}
          <a href="mailto:contact@example.com" className="text-primary-600 hover:text-primary-700">
            contact@example.com
          </a>
        </p>
      </div>
    </form>
  )
}