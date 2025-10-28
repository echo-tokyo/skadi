import clsx from 'clsx'

interface UIClassOptions {
  fluid?: boolean
  size?: 's' | 'm'
  additionalClasses?: string[]
}

export const getUIClasses = (
  baseClass: string,
  options: UIClassOptions,
  styles: Record<string, string>,
): string => {
  const { fluid, size, additionalClasses = [] } = options

  return clsx(
    baseClass,
    fluid && styles.fluid,
    size === 's' && styles.size_s,
    size === 'm' && styles.size_m,
    ...additionalClasses,
  )
}
