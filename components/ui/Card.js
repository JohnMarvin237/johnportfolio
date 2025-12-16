/**
 * Composant Card réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.hover - Effet de hover
 * @param {Function} props.onClick - Handler du clic (optionnel)
 */
export default function Card({
  children,
  className = '',
  hover = false,
  onClick
}) {
  const baseStyles = 'bg-white rounded-lg shadow-md p-6 transition-all duration-200'

  const hoverStyles = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : ''

  const Component = onClick ? 'div' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </Component>
  )
}