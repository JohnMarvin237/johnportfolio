// app/admin/projects/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

type FormData = z.infer<typeof projectBilingualFormSchema>;

export default function EditProjectPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectBilingualFormSchema),
  });

  const [projectId, setProjectId] = useState<string | null>(null);
  const [locale, setLocale] = useState('fr');

  useEffect(() => {
    params.then(p => {
      setProjectId(p.id);
      setLocale(p.locale || 'fr');
    });
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(`/projects/${projectId}`), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Projet non trouvé');
      }

      const project = await response.json();

      // Transform data for form
      reset({
        title_fr: project.title_fr || project.title || '',
        title_en: project.title_en || '',
        description_fr: project.description_fr || project.description || '',
        description_en: project.description_en || '',
        longDesc_fr: project.longDesc_fr || project.longDesc || '',
        longDesc_en: project.longDesc_en || '',
        organization_fr: project.organization_fr || project.organization || '',
        organization_en: project.organization_en || '',
        technologies: project.technologies.join(', '),
        imageUrl: project.imageUrl || '',
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured || false,
        order: project.order || 0,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      });
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
      const apiData = transformProjectFormData(data);

      const response = await fetch(getApiUrl(`/projects/${projectId}`), {
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

      router.push(`/${locale}/admin/projects`);
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
          title="Modifier le projet"
          description="Mettre à jour les informations du projet"
        />
        <ErrorDisplay error={error} onRetry={fetchProject} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Modifier le projet"
        description="Mettre à jour les informations du projet"
      />

      <div className="max-w-3xl bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

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