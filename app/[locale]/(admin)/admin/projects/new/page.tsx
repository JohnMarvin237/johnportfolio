// app/admin/projects/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectBilingualFormSchema, transformProjectFormData } from '@/lib/schemas/project-bilingual.schema';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import PageHeader from '@/components/admin/PageHeader';
import FormField from '@/components/admin/FormField';
import BilingualFormField from '@/components/admin/BilingualFormField';
import Button from '@/components/ui/Button';

type FormData = z.infer<typeof projectBilingualFormSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'fr';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectBilingualFormSchema),
    defaultValues: {
      featured: false,
      order: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Transform form data to API format
      const apiData = transformProjectFormData(data);

      const response = await fetch(getApiUrl('/projects'), {
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

      router.push(`/${locale}/admin/projects`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Nouveau projet"
        description="Ajouter un nouveau projet à votre portfolio"
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
              label="Titre du projet"
              name="title"
              required
              register={register}
              errorFr={errors.title_fr?.message}
              errorEn={errors.title_en?.message}
              placeholderFr="Nom du projet en français"
              placeholderEn="Project name in English"
            />

            <BilingualFormField
              label="Description courte"
              name="description"
              type="textarea"
              required
              register={register}
              errorFr={errors.description_fr?.message}
              errorEn={errors.description_en?.message}
              placeholderFr="Description concise du projet en français"
              placeholderEn="Brief project description in English"
              rows={3}
            />

            <BilingualFormField
              label="Description détaillée"
              name="longDesc"
              type="textarea"
              register={register}
              errorFr={errors.longDesc_fr?.message}
              errorEn={errors.longDesc_en?.message}
              placeholderFr="Description complète du projet en français (optionnel)"
              placeholderEn="Complete project description in English (optional)"
              rows={5}
            />

            <FormField
              label="Technologies"
              name="technologies"
              required
              register={register}
              error={errors.technologies?.message}
              placeholder="React, Next.js, TypeScript (séparées par des virgules)"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date de début"
                name="startDate"
                type="date"
                register={register}
                error={errors.startDate?.message}
              />

              <FormField
                label="Date de fin"
                name="endDate"
                type="date"
                register={register}
                error={errors.endDate?.message}
              />
            </div>

            <BilingualFormField
              label="Organisation"
              name="organization"
              register={register}
              errorFr={errors.organization_fr?.message}
              errorEn={errors.organization_en?.message}
              placeholderFr="Nom de l'entreprise ou personnel"
              placeholderEn="Company name or personal"
            />

            <FormField
              label="URL de l'image"
              name="imageUrl"
              type="url"
              register={register}
              error={errors.imageUrl?.message}
              placeholder="https://example.com/image.jpg"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="URL de démo"
                name="demoUrl"
                type="url"
                register={register}
                error={errors.demoUrl?.message}
                placeholder="https://demo.example.com"
              />

              <FormField
                label="URL GitHub"
                name="githubUrl"
                type="url"
                register={register}
                error={errors.githubUrl?.message}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Ordre d'affichage"
                name="order"
                type="number"
                register={register}
                error={errors.order?.message}
                placeholder="0"
              />

              <div className="flex items-end">
                <FormField
                  label="Projet featured"
                  name="featured"
                  type="checkbox"
                  register={register}
                  error={errors.featured?.message}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1 md:flex-initial"
            >
              {isSubmitting ? 'Création...' : 'Créer le projet'}
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