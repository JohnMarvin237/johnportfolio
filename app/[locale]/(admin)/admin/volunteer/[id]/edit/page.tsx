// app/[locale]/admin/volunteer/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { volunteerBilingualFormSchema, transformVolunteerFormData, transformVolunteerToFormData } from '@/lib/schemas/volunteer-bilingual.schema';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import PageHeader from '@/components/admin/PageHeader';
import FormField from '@/components/admin/FormField';
import BilingualFormField from '@/components/admin/BilingualFormField';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { z } from 'zod';

// Create a modified schema that ensures current is always boolean
const editFormSchema = volunteerBilingualFormSchema.extend({
  current: z.boolean()
});

type FormData = z.infer<typeof editFormSchema>;

export default function EditVolunteerPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState('fr');
  const getAuthHeaders = useAuthHeaders();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editFormSchema),
  });

  const watchCurrent = watch('current');
  const [volunteerId, setVolunteerId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => {
      setVolunteerId(p.id);
      setLocale(p.locale || 'fr');
    });
  }, [params]);

  useEffect(() => {
    if (volunteerId) {
      fetchVolunteer();
    }
  }, [volunteerId]);

  const fetchVolunteer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(`/volunteer/${volunteerId}`), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Expérience bénévole non trouvée');
      }

      const volunteer = await response.json();
      const formData = transformVolunteerToFormData(volunteer);
      reset(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Transform form data to API format
      const apiData = transformVolunteerFormData(data);

      const response = await fetch(getApiUrl(`/volunteer/${volunteerId}`), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      router.push(`/${locale}/admin/volunteer`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && isLoading === false && !isSubmitting) {
    return (
      <div>
        <PageHeader
          title="Modifier l'expérience bénévole"
          description="Mettre à jour les informations de l'expérience bénévole"
        />
        <ErrorDisplay error={error} onRetry={fetchVolunteer} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Modifier l'expérience bénévole"
        description="Mettre à jour les informations de l'expérience bénévole"
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
              placeholderFr="Ex: Bénévole en développement web"
              placeholderEn="Ex: Web Development Volunteer"
            />

            <BilingualFormField
              label="Organisation"
              name="organization"
              required
              register={register}
              errorFr={errors.organization_fr?.message}
              errorEn={errors.organization_en?.message}
              placeholderFr="Nom de l'organisation"
              placeholderEn="Organization name"
            />

            <BilingualFormField
              label="Lieu"
              name="location"
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
              label="Engagement en cours"
              name="current"
              type="checkbox"
              register={register}
              error={errors.current?.message}
            />

            <BilingualFormField
              label="Description"
              name="description"
              type="textarea"
              required
              register={register}
              errorFr={errors.description_fr?.message}
              errorEn={errors.description_en?.message}
              placeholderFr="Décrivez votre rôle, vos responsabilités et l'impact de votre engagement"
              placeholderEn="Describe your role, responsibilities, and the impact of your involvement"
              rows={6}
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
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
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