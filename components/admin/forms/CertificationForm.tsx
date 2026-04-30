'use client';
// components/admin/forms/CertificationForm.tsx
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationSchema, type CertificationInput } from '@/lib/schemas/certification.schema';
import Button from '@/components/ui/Button';
import FormField from './FormField';
import BilingualField from './BilingualField';
import ArrayField from './ArrayField';
import DateField from './DateField';

function toDateString(val: unknown): string {
  if (!val) return '';
  const d = new Date(val as string);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

interface CertificationFormProps {
  defaultValues?: Partial<CertificationInput>;
  onSubmit: (data: CertificationInput) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function CertificationForm({ defaultValues, onSubmit, loading = false, error }: CertificationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CertificationInput>({
    // Cast: zodResolver infers z.coerce.date() input as unknown; CertificationInput uses the output (Date) type
    resolver: zodResolver(certificationSchema) as Resolver<CertificationInput>,
    defaultValues: {
      order: 0,
      skills: [],
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </div>
      )}

      <BilingualField
        label="Titre"
        baseName="title"
        frName="titleFr"
        enName="titleEn"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="Organisme émetteur"
        required
        error={errors.issuer?.message}
        {...register('issuer')}
      />

      <FormField
        label="ID du credential (optionnel)"
        error={errors.credentialId?.message}
        {...register('credentialId')}
      />

      <FormField
        label="URL du credential (optionnel)"
        type="url"
        error={errors.credentialUrl?.message}
        {...register('credentialUrl')}
      />

      <BilingualField
        label="Description (optionnel)"
        baseName="description"
        frName="descriptionFr"
        enName="descriptionEn"
        register={register}
        errors={errors}
        type="textarea"
      />

      <Controller
        control={control}
        name="skills"
        render={({ field }) => (
          <ArrayField
            label="Compétences"
            value={field.value ?? []}
            onChange={field.onChange}
            error={errors.skills?.message as string | undefined}
            placeholder="Ex. Cloud, DevOps..."
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="issueDate"
          render={({ field }) => (
            <DateField
              label="Date d'émission"
              name="issueDate"
              error={errors.issueDate?.message as string | undefined}
              value={toDateString(field.value)}
              onChange={(e) => field.onChange(e.target.value || null)}
            />
          )}
        />
        <Controller
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <DateField
              label="Date d'expiration"
              name="expiryDate"
              error={errors.expiryDate?.message as string | undefined}
              value={toDateString(field.value)}
              onChange={(e) => field.onChange(e.target.value || null)}
            />
          )}
        />
      </div>

      <FormField
        label="Ordre"
        type="number"
        error={errors.order?.message}
        {...register('order', { valueAsNumber: true })}
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
