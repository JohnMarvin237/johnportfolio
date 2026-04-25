// app/[locale]/admin/certifications/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationBilingualFormSchema, transformCertificationFormData } from '@/lib/schemas/certification-bilingual.schema';
import { useAuthHeaders } from '@/lib/hooks/useAuth';
import { getApiUrl } from '@/lib/utils';
import PageHeader from '@/components/admin/PageHeader';
import FormField from '@/components/admin/FormField';
import BilingualFormField from '@/components/admin/BilingualFormField';
import Button from '@/components/ui/Button';
import { z } from 'zod';

type FormData = z.infer<typeof certificationBilingualFormSchema>;

export default function NewCertificationPage() {
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
    resolver: zodResolver(certificationBilingualFormSchema),
    defaultValues: {
      order: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Transform form data to API format
      const apiData = transformCertificationFormData(data);

      const response = await fetch(getApiUrl('/certifications'), {
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

      router.push(`/${locale}/admin/certifications`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Nouvelle certification"
        description="Ajouter une nouvelle certification professionnelle"
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
              label="Titre de la certification"
              name="title"
              required
              register={register}
              errorFr={errors.title_fr?.message}
              errorEn={errors.title_en?.message}
              placeholderFr="Ex: AWS Certified Solutions Architect"
              placeholderEn="Ex: AWS Certified Solutions Architect"
            />

            <BilingualFormField
              label="Organisme émetteur"
              name="issuer"
              required
              register={register}
              errorFr={errors.issuer_fr?.message}
              errorEn={errors.issuer_en?.message}
              placeholderFr="Ex: Amazon Web Services"
              placeholderEn="Ex: Amazon Web Services"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date d'obtention"
                name="issueDate"
                type="date"
                register={register}
                error={errors.issueDate?.message}
              />

              <FormField
                label="Date d'expiration"
                name="expiryDate"
                type="date"
                register={register}
                error={errors.expiryDate?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="ID de certification"
                name="credentialId"
                register={register}
                error={errors.credentialId?.message}
                placeholder="Ex: ABC123DEF456"
              />

              <FormField
                label="URL de vérification"
                name="credentialUrl"
                type="url"
                register={register}
                error={errors.credentialUrl?.message}
                placeholder="https://certifications.example.com/verify/ABC123"
              />
            </div>

            <BilingualFormField
              label="Description"
              name="description"
              type="textarea"
              register={register}
              errorFr={errors.description_fr?.message}
              errorEn={errors.description_en?.message}
              placeholderFr="Description de la certification et des compétences validées"
              placeholderEn="Description of the certification and validated skills"
              rows={4}
            />

            <BilingualFormField
              label="Compétences acquises"
              name="skills"
              register={register}
              errorFr={errors.skills_fr?.message}
              errorEn={errors.skills_en?.message}
              placeholderFr="Cloud Architecture, AWS, Solutions Design (séparées par des virgules)"
              placeholderEn="Cloud Architecture, AWS, Solutions Design (separated by commas)"
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
              {isSubmitting ? 'Création...' : 'Créer la certification'}
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