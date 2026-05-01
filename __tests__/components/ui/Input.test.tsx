import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '@/components/ui/Input'

describe('Input', () => {
  it('should render the label when the label prop is provided', () => {
    render(<Input name="email" label="Adresse email" />)
    expect(screen.getByText('Adresse email')).toBeInTheDocument()
  })

  it('should not render a label element when no label prop is given', () => {
    render(<Input name="email" />)
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('should render the error message when the error prop is set', () => {
    render(<Input name="email" error="Email invalide" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Email invalide')
  })

  it('should not render an error message when error prop is absent', () => {
    render(<Input name="email" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should call onChange with the new value when the user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<Input name="name" onChange={handleChange} />)
    await user.type(screen.getByRole('textbox'), 'Alice')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should render a textarea when type="textarea"', () => {
    render(<Input name="message" type="textarea" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    // textarea has a tagName of TEXTAREA
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
  })

  it('should mark the input as aria-invalid when error is set', () => {
    render(<Input name="email" error="Required" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})
