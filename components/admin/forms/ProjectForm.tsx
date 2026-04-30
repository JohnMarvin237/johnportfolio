'use client';
// components/admin/forms/ProjectForm.tsx
// Create/edit form for Project entities.
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectInput } from '@/lib/schemas/project.schema';
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

interface ProjectFormProps {
  defaultValues?: Partial<ProjectInput>;
  onSubmit: (data: ProjectInput) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function ProjectForm({ defaultValues, onSubmit, loading = false, error }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectInput>({
    // Cast: zodResolver infers z.coerce.date() input as unknown; ProjectInput uses the output (Date) type
    resolver: zodResolver(projectSchema) as Resolver<ProjectInput>,
    defaultValues: {
      featured: false,
      order: 0,
      technologies: [],
      ...defaultValues,
    },
  });

  const featured = watch('featured');

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

      <BilingualField
        label="Description longue (optionnel)"
        baseName="longDesc"
        frName="longDescFr"
        enName="longDescEn"
        register={register}
        errors={errors}
        type="textarea"
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
            placeholder="Ex. React, TypeScript..."
          />
        )}
      />

      <FormField
        label="URL de l'image"
        type="url"
        error={errors.imageUrl?.message}
        {...register('imageUrl')}
      />

      <FormField
        label="URL de la démo"
        type="url"
        error={errors.demoUrl?.message}
        {...register('demoUrl')}
      />

      <FormField
        label="URL GitHub"
        type="url"
        error={errors.githubUrl?.message}
        {...register('githubUrl')}
      />

      <FormField
        label="Organisation"
        error={errors.organization?.message}
        {...register('organization')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DateField
              label="Date de début"
              name="startDate"
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

      <FormField
        label="Ordre"
        type="number"
        error={errors.order?.message}
        {...register('order', { valueAsNumber: true })}
      />

      <SwitchField
        label="Mis en avant (featured)"
        name="featured"
        checked={featured ?? false}
        onChange={(val) => setValue('featured', val)}
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
