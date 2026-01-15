// app/[locale]/admin/experiences/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceBilingualFormSchema, transformExperienceFormData } from '@/lib/schemas/experience-bilingual.schema';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import PageHeader from '@/components/admin/PageHeader';
import FormField from '@/components/admin/FormField';
import BilingualFormField from '@/components/admin/BilingualFormField';
import Button from '@/components/ui/Button';
import { z } from 'zod';

type FormData = z.infer<typeof experienceBilingualFormSchema>;

export default function NewExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'fr';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(experienceBilingualFormSchema),
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

      // Transform form data to API format
      const apiData = transformExperienceFormData(data);

      const response = await fetch(getApiUrl('/experiences'), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la création');
      }

      router.push(`/${locale}/admin/experiences`);
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

          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Le contenu en français est obligatoire. Le contenu en anglais est optionnel mais recommandé pour une meilleure visibilité internationale.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <BilingualFormField
              label="Titre du poste"
              name="title"
              required
              register={register}
              errorFr={errors.title_fr?.message}
              errorEn={errors.title_en?.message}
              placeholderFr="Ex: Développeur Full-Stack"
              placeholderEn="Ex: Full-Stack Developer"
            />

            <BilingualFormField
              label="Entreprise"
              name="company"
              required
              register={register}
              errorFr={errors.company_fr?.message}
              errorEn={errors.company_en?.message}
              placeholderFr="Nom de l'entreprise"
              placeholderEn="Company name"
            />

            <FormField
              label="URL de l'entreprise"
              name="companyUrl"
              type="url"
              register={register}
              error={errors.companyUrl?.message}
              placeholder="https://entreprise.com"
            />

            <BilingualFormField
              label="Lieu"
              name="location"
              required
              register={register}
              errorFr={errors.location_fr?.message}
              errorEn={errors.location_en?.message}
              placeholderFr="Ex: Ottawa, ON"
              placeholderEn="Ex: Ottawa, ON"
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

            <BilingualFormField
              label="Description du poste"
              name="description"
              type="textarea"
              required
              register={register}
              errorFr={errors.description_fr?.message}
              errorEn={errors.description_en?.message}
              placeholderFr="Description du poste et des responsabilités"
              placeholderEn="Job description and responsibilities"
              rows={4}
            />

            <BilingualFormField
              label="Réalisations principales"
              name="achievements"
              type="textarea"
              required
              register={register}
              errorFr={errors.achievements_fr?.message}
              errorEn={errors.achievements_en?.message}
              placeholderFr="Une réalisation par ligne:\n• Amélioration de la performance de 50%\n• Implémentation d'une nouvelle architecture"
              placeholderEn="One achievement per line:\n• Improved performance by 50%\n• Implemented new architecture"
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