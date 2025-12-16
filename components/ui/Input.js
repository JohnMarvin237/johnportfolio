import { forwardRef } from 'react'

/**
 * Composant Input réutilisable
 * @param {Object} props
 * @param {string} props.label - Label du champ
 * @param {'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea'} props.type - Type d'input
 * @param {string} props.name - Nom du champ
 * @param {string} props.placeholder - Placeholder
 * @param {string} props.value - Valeur
 * @param {Function} props.onChange - Handler de changement
 * @param {string} props.error - Message d'erreur
 * @param {boolean} props.required - Champ requis
 * @param {number} props.rows - Nombre de lignes (pour textarea)
 * @param {string} props.className - Classes CSS additionnelles
 */
const Input = forwardRef(({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const baseStyles = `
    w-full px-4 py-2 border rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}
  `

  const labelStyles = `
    block text-sm font-medium text-gray-700 mb-1
    ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
  `

  const inputElement = type === 'textarea' ? (
    <textarea
      ref={ref}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className={`${baseStyles} resize-vertical min-h-[100px] ${className}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
  ) : (
    <input
      ref={ref}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`${baseStyles} ${className}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
  )

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className={labelStyles}>
          {label}
        </label>
      )}
      {inputElement}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input