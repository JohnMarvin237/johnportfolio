'use client';
// components/admin/forms/EducationForm.tsx
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, type EducationInput } from '@/lib/schemas/education.schema';
import Button from '@/components/ui/Button';
import FormField from './FormField';
import BilingualField from './BilingualField';
import DateField from './DateField';
import SwitchField from './SwitchField';

function toDateString(val: unknown): string {
  if (!val) return '';
  const d = new Date(val as string);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

interface EducationFormProps {
  defaultValues?: Partial<EducationInput>;
  onSubmit: (data: EducationInput) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function EducationForm({ defaultValues, onSubmit, loading = false, error }: EducationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EducationInput>({
    // Cast: zodResolver infers z.coerce.date() input as unknown; EducationInput uses the output (Date) type
    resolver: zodResolver(educationSchema) as Resolver<EducationInput>,
    defaultValues: {
      current: false,
      order: 0,
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
        label="Diplôme"
        baseName="degree"
        frName="degreeFr"
        enName="degreeEn"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="Institution"
        required
        error={errors.institution?.message}
        {...register('institution')}
      />

      <FormField
        label="Localisation"
        required
        error={errors.location?.message}
        {...register('location')}
      />

      <BilingualField
        label="Domaine d'études (optionnel)"
        baseName="field"
        frName="fieldFr"
        enName="fieldEn"
        register={register}
        errors={errors}
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

      <BilingualField
        label="Note / mention (optionnel)"
        baseName="note"
        frName="noteFr"
        enName="noteEn"
        register={register}
        errors={errors}
      />

      <FormField
        label="GPA (optionnel)"
        error={errors.gpa?.message}
        {...register('gpa')}
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
        label="Formation en cours"
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
