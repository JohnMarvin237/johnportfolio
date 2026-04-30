'use client';
// components/admin/forms/ExperienceForm.tsx
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema, type ExperienceInput } from '@/lib/schemas/experience.schema';
import Button from '@/components/ui/Button';
import FormField from './FormField';
import BilingualField from './BilingualField';
import ArrayField from './ArrayField';
import DateField from './DateField';
import SwitchField from './SwitchField';

function toDateString(val: unknown): string {
  if (!val) return '';
  const d = new Date(val as string);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

interface ExperienceFormProps {
  defaultValues?: Partial<ExperienceInput>;
  onSubmit: (data: ExperienceInput) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function ExperienceForm({ defaultValues, onSubmit, loading = false, error }: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceInput>({
    // Cast: zodResolver infers z.coerce.date() input as unknown; ExperienceInput uses the output (Date) type
    resolver: zodResolver(experienceSchema) as Resolver<ExperienceInput>,
    defaultValues: {
      current: false,
      order: 0,
      achievements: [],
      achievementsFr: [],
      achievementsEn: [],
      technologies: [],
      ...defaultValues,
    },
  });

  const current = watch('current');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </div>
      )}

      <BilingualField
        label="Titre du poste"
        baseName="title"
        frName="titleFr"
        enName="titleEn"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="Entreprise"
        required
        error={errors.company?.message}
        {...register('company')}
      />

      <FormField
        label="URL de l'entreprise"
        type="url"
        error={errors.companyUrl?.message}
        {...register('companyUrl')}
      />

      <FormField
        label="Localisation"
        required
        error={errors.location?.message}
        {...register('location')}
      />

      <BilingualField
        label="Description"
        baseName="description"
        frName="descriptionFr"
        enName="descriptionEn"
        register={register}
        errors={errors}
        type="textarea"
        required
      />

      <Controller
        control={control}
        name="achievements"
        render={({ field }) => (
          <ArrayField
            label="Réalisations (base)"
            value={field.value ?? []}
            onChange={field.onChange}
            error={errors.achievements?.message as string | undefined}
            placeholder="Ajouter une réalisation..."
          />
        )}
      />

      <Controller
        control={control}
        name="achievementsFr"
        render={({ field }) => (
          <ArrayField
            label="Réalisations (FR)"
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="Version française..."
          />
        )}
      />

      <Controller
        control={control}
        name="achievementsEn"
        render={({ field }) => (
          <ArrayField
            label="Réalisations (EN)"
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="English version..."
          />
        )}
      />

      <Controller
        control={control}
        name="technologies"
        render={({ field }) => (
          <ArrayField
            label="Technologies"
            value={field.value ?? []}
            onChange={field.onChange}
            error={errors.technologies?.message as string | undefined}
            placeholder="Ex. React, Node.js..."
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DateField
              label="Date de début"
              name="startDate"
              required
              error={errors.startDate?.message as string | undefined}
              value={toDateString(field.value)}
              onChange={(e) => field.onChange(e.target.value || null)}
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DateField
              label="Date de fin"
              name="endDate"
              error={errors.endDate?.message as string | undefined}
              value={toDateString(field.value)}
              onChange={(e) => field.onChange(e.target.value || null)}
            />
          )}
        />
      </div>

      <SwitchField
        label="Poste actuel"
        name="current"
        checked={current ?? false}
        onChange={(val) => setValue('current', val)}
      />

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
