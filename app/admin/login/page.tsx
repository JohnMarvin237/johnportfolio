'use client'

import type React from 'react'
import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
// Input.js uses forwardRef without TypeScript generics; cast to typed component to avoid inference as RefAttributes<any>
import InputJs from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  rows?: number
}
const Input = InputJs as React.ComponentType<InputProps>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="admin@portfolio.com"
            autoComplete="email"
            className="rounded-t-md"
          />
        </div>
        <div>
          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className="rounded-b-md"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </div>

      <div className="text-center">
        <a href="/" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
          &larr; Retour au site
        </a>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Administration Portfolio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Connectez-vous pour accéder au tableau de bord
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-500">Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
