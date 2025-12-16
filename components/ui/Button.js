/**
 * Composant Button réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {'primary' | 'secondary' | 'outline'} props.variant - Style du bouton
 * @param {'sm' | 'md' | 'lg'} props.size - Taille du bouton
 * @param {Function} props.onClick - Handler du clic
 * @param {boolean} props.disabled - État désactivé
 * @param {'button' | 'submit' | 'reset'} props.type - Type du bouton
 * @param {string} props.className - Classes CSS additionnelles
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}