'use client';
// app/admin/login/page.tsx
// Public login page — wrapped in Suspense because useSearchParams requires it.
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { loginSchema, type LoginInput } from '@/lib/schemas/login.schema';
import { safeCallbackUrl } from '@/lib/admin/safe-callback-url';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/forms/FormField';

function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      // The server sets the HttpOnly auth_token cookie via Set-Cookie.
      await axios.post('/api/auth/login', data, { withCredentials: true });
      window.location.assign(callbackUrl);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const apiError = (err.response?.data as { error?: string } | undefined)?.error;
        if (status === 401) {
          setServerError('Email ou mot de passe incorrect.');
        } else if (status === 503) {
          setServerError(
            apiError ??
              'Service temporairement indisponible. La base de données ne répond pas — veuillez réessayer dans un instant.'
          );
        } else if (status === 400) {
          setServerError(apiError ?? 'Données invalides.');
        } else {
          setServerError(apiError ?? 'Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Connexion Admin
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Accès réservé à l&apos;administrateur
            </p>
          </div>

          {serverError && (
            <div
              className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
              label="Email"
              type="email"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormField
              label="Mot de passe"
              type="password"
              required
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
