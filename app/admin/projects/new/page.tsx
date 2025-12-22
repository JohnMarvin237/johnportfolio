// app/admin/projects/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/schemas/project.schema';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import PageHeader from '@/components/admin/PageHeader';
import FormField from '@/components/admin/FormField';
import Button from '@/components/ui/Button';
import { z } from 'zod';

// Input schema for form (what the form fields expect)
const formInputSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  longDesc: z.string().optional(),
  technologies: z.string().min(1, "Au moins une technologie est requise"),
  imageUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  organization: z.string().optional(),
  order: z.union([z.string(), z.number()]).optional(),
});

type FormData = z.infer<typeof formInputSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const getAuthHeaders = useAuthHeaders();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      featured: false,
      order: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch(getApiUrl('/projects'), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
          order: data.order ? Number(data.order) : 0,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la création');
      }

      router.push('/admin/projects');
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

          <div className="grid grid-cols-1 gap-6">
            <FormField
              label="Titre"
              name="title"
              required
              register={register}
              error={errors.title?.message}
              placeholder="Nom du projet"
            />

            <FormField
              label="Description courte"
              name="description"
              type="textarea"
              required
              register={register}
              error={errors.description?.message}
              placeholder="Description concise du projet"
              rows={3}
            />

            <FormField
              label="Description détaillée"
              name="longDesc"
              type="textarea"
              register={register}
              error={errors.longDesc?.message}
              placeholder="Description complète du projet (optionnel)"
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

            <FormField
              label="Organisation"
              name="organization"
              register={register}
              error={errors.organization?.message}
              placeholder="Nom de l'entreprise ou personnel"
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