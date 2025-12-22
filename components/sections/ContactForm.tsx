// components/sections/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactMessageSchema } from '@/lib/schemas/contact.schema';
import { z } from 'zod';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

type ContactFormData = z.infer<typeof contactMessageSchema>;

/**
 * Formulaire de contact avec validation Zod
 * Envoie un message via l'API /api/contact
 */
export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactMessageSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }

      setSubmitSuccess(true);
      reset(); // Réinitialiser le formulaire
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Message de succès */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.
          </p>
        </div>
      )}

      {/* Message d'erreur */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">
            ✗ {submitError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nom */}
        <Input
          label="Nom *"
          placeholder="Votre nom complet"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Email */}
        <Input
          label="Email *"
          type="email"
          placeholder="votre.email@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Sujet (optionnel) */}
        <Input
          label="Sujet"
          placeholder="Objet de votre message"
          error={errors.subject?.message}
          helperText="Optionnel"
          {...register('subject')}
        />

        {/* Message */}
        <Textarea
          label="Message *"
          placeholder="Votre message..."
          rows={6}
          error={errors.message?.message}
          {...register('message')}
        />

        {/* Bouton d'envoi */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            * Champs obligatoires
          </p>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </Button>
        </div>
      </form>
    </div>
  );
}
