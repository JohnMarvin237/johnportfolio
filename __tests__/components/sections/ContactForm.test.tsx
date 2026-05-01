import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '@/components/sections/ContactForm'

// The real LanguageContext uses useRouter and localStorage — neither available in jsdom.
// We provide a minimal stub that passes translation keys back as-is so assertions
// can key on the i18n key strings without depending on the French/English text.
vi.mock('@/lib/i18n/LanguageContext', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

// next/navigation is required by LanguageProvider; stub it to avoid the real router.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
})

describe('ContactForm', () => {
  it('should render all form fields', () => {
    render(<ContactForm />)

    // Input components render a <label> element — we find by the i18n key used as text.
    expect(screen.getByText('contactForm.name')).toBeInTheDocument()
    expect(screen.getByText('contactForm.email')).toBeInTheDocument()
    expect(screen.getByText('contactForm.subject')).toBeInTheDocument()
    expect(screen.getByText('contactForm.message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'contactForm.submit' })).toBeInTheDocument()
  })

  it('should show a validation error when name is missing and the form is submitted', async () => {
    // This test exercises the client-side validateForm() path.
    // Leaving name empty guarantees the name-required error fires.
    const user = userEvent.setup()
    const { container } = render(<ContactForm />)

    // Leave name blank; fill a valid email and message so only name fails.
    const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')!
    const messageInput = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]')!

    await user.type(emailInput, 'alice@example.com')
    await user.type(messageInput, 'Un message suffisamment long.')

    // Submit via fireEvent on the form element — more reliable than clicking
    // the submit button in jsdom which can fail to trigger onSubmit on React 19.
    fireEvent.submit(container.querySelector('form')!)

    // validateForm() sets errors.name because name is blank → alert renders
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    // fetch must not be called when client validation fails
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should call fetch and show success state on valid submission', async () => {
    const user = userEvent.setup()

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Message envoyé avec succès', id: 'msg-1' }),
    })

    const { container } = render(<ContactForm />)

    const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]')!
    const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')!
    const messageInput = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]')!

    await user.type(nameInput, 'Alice Dupont')
    await user.type(emailInput, 'alice@example.com')
    await user.type(messageInput, 'Bonjour, je souhaite vous contacter.')

    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({ method: 'POST' })
      )
    })

    await waitFor(() => {
      expect(screen.getByText('contactForm.success')).toBeInTheDocument()
    })
  })

  it('should show an error state when the server returns a non-ok response', async () => {
    const user = userEvent.setup()

    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Trop de tentatives.' }),
    })

    const { container } = render(<ContactForm />)

    const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]')!
    const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]')!
    const messageInput = document.querySelector<HTMLTextAreaElement>('textarea[name="message"]')!

    await user.type(nameInput, 'Alice Dupont')
    await user.type(emailInput, 'alice@example.com')
    await user.type(messageInput, 'Un message suffisamment long.')

    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      expect(screen.getByText('Trop de tentatives.')).toBeInTheDocument()
    })
  })
})
