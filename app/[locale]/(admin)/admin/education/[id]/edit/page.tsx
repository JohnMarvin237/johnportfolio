// app/[locale]/admin/education/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationBilingualFormSchema, transformEducationFormData, transformEducationToFormData } from '@/lib/schemas/education-bilingual.schema';
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
const editFormSchema = educationBilingualFormSchema.extend({
  current: z.boolean()
});

type FormData = z.infer<typeof editFormSchema>;

export default function EditEducationPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
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
    defaultValues: {
      current: false,
    },
  });

  const watchCurrent = watch('current');
  const [educationId, setEducationId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => {
      setEducationId(p.id);
      setLocale(p.locale || 'fr');
    });
  }, [params]);

  useEffect(() => {
    if (educationId) {
      fetchEducation();
    }
  }, [educationId]);

  const fetchEducation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(`/education/${educationId}`), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Formation non trouvée');
      }

      const education = await response.json();
      const formData = transformEducationToFormData(education);
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
      const apiData = transformEducationFormData(data);

      const response = await fetch(getApiUrl(`/education/${educationId}`), {
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

      router.push(`/${locale}/admin/education`);
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
          title="Modifier la formation"
          description="Mettre à jour les informations de la formation"
        />
        <ErrorDisplay error={error} onRetry={fetchEducation} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Modifier la formation"
        description="Mettre à jour les informations de la formation"
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
              label="Diplôme"
              name="degree"
              required
              register={register}
              errorFr={errors.degree_fr?.message}
              errorEn={errors.degree_en?.message}
              placeholderFr="Ex: Maîtrise en informatique"
              placeholderEn="Ex: Master of Computer Science"
            />

            <BilingualFormField
              label="Institution"
              name="institution"
              required
              register={register}
              errorFr={errors.institution_fr?.message}
              errorEn={errors.institution_en?.message}
              placeholderFr="Ex: Université d'Ottawa"
              placeholderEn="Ex: University of Ottawa"
            />

            <BilingualFormField
              label="Domaine d'étude"
              name="field"
              register={register}
              errorFr={errors.field_fr?.message}
              errorEn={errors.field_en?.message}
              placeholderFr="Ex: Génie logiciel"
              placeholderEn="Ex: Software Engineering"
            />

            <FormField
              label="Lieu"
              name="location"
              required
              register={register}
              error={errors.location?.message}
              placeholder="Ex: Ottawa, ON"
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
              label="Formation en cours"
              name="current"
              type="checkbox"
              register={register}
              error={errors.current?.message}
            />

            <BilingualFormField
              label="Description"
              name="description"
              type="textarea"
              register={register}
              errorFr={errors.description_fr?.message}
              errorEn={errors.description_en?.message}
              placeholderFr="Description de la formation, cours principaux, projets, etc."
              placeholderEn="Description of the program, main courses, projects, etc."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Moyenne (GPA)"
                name="gpa"
                register={register}
                error={errors.gpa?.message}
                placeholder="Ex: 3.8"
              />

              <BilingualFormField
                label="Note additionnelle"
                name="note"
                register={register}
                errorFr={errors.note_fr?.message}
                errorEn={errors.note_en?.message}
                placeholderFr="Ex: Équivalent Maîtrise canadienne"
                placeholderEn="Ex: Equivalent to Canadian Master's degree"
              />
            </div>

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