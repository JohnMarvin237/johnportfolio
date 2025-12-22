// app/admin/experiences/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema } from '@/lib/schemas/experience.schema';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import PageHeader from '@/components/admin/PageHeader';
import FormField from '@/components/admin/FormField';
import Button from '@/components/ui/Button';
import { z } from 'zod';

// Input schema for form (what the form fields expect)
const formInputSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  company: z.string().min(1, "L'entreprise est requise"),
  companyUrl: z.string().optional(),
  location: z.string().min(1, "Le lieu est requis"),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().min(1, "La description est requise"),
  achievements: z.string().min(1, "Au moins une réalisation est requise"),
  technologies: z.string().min(1, "Au moins une technologie est requise"),
  order: z.union([z.string(), z.number()]).optional(),
});

type FormData = z.infer<typeof formInputSchema>;

export default function NewExperiencePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      current: false,
      order: 0,
    },
  });

  const watchCurrent = watch('current');

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch(getApiUrl('/experiences'), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
          achievements: data.achievements.split('\n').map(t => t.trim()).filter(Boolean),
          order: data.order ? Number(data.order) : 0,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la création');
      }

      router.push('/admin/experiences');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Nouvelle expérience"
        description="Ajouter une nouvelle expérience professionnelle"
      />

      <div className="max-w-3xl bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <FormField
              label="Titre du poste"
              name="title"
              required
              register={register}
              error={errors.title?.message}
              placeholder="Développeur Full-Stack"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Entreprise"
                name="company"
                required
                register={register}
                error={errors.company?.message}
                placeholder="Nom de l'entreprise"
              />

              <FormField
                label="URL de l'entreprise"
                name="companyUrl"
                type="url"
                register={register}
                error={errors.companyUrl?.message}
                placeholder="https://entreprise.com"
              />
            </div>

            <FormField
              label="Lieu"
              name="location"
              required
              register={register}
              error={errors.location?.message}
              placeholder="Ottawa, ON"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date de début"
                name="startDate"
                type="date"
                required
                register={register}
                error={errors.startDate?.message}
              />

              {!watchCurrent && (
                <FormField
                  label="Date de fin"
                  name="endDate"
                  type="date"
                  register={register}
                  error={errors.endDate?.message}
                />
              )}
            </div>

            <FormField
              label="Poste actuel"
              name="current"
              type="checkbox"
              register={register}
              error={errors.current?.message}
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              required
              register={register}
              error={errors.description?.message}
              placeholder="Description du poste et des responsabilités"
              rows={4}
            />

            <FormField
              label="Réalisations"
              name="achievements"
              type="textarea"
              required
              register={register}
              error={errors.achievements?.message}
              placeholder="Une réalisation par ligne&#10;- Amélioration de la performance de 50%&#10;- Implémentation d'une nouvelle architecture"
              rows={6}
            />

            <FormField
              label="Technologies"
              name="technologies"
              required
              register={register}
              error={errors.technologies?.message}
              placeholder="React, Node.js, PostgreSQL (séparées par des virgules)"
            />

            <FormField
              label="Ordre d'affichage"
              name="order"
              type="number"
              register={register}
              error={errors.order?.message}
              placeholder="0"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1 md:flex-initial"
            >
              {isSubmitting ? 'Création...' : 'Créer l\'expérience'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}