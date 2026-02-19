import { MouseEvent, ReactNode } from 'react'
import { getUIClasses } from '@/shared/lib/classNames'
import styles from './styles.module.scss'
import commonStyles from '../styles/common.module.scss'

interface IProps {
  children: string
  onClick?: () => void
  fluid?: boolean
  size?: 's' | 'm'
  disabled?: boolean
  type?: 'button' | 'submit'
  color?: 'primary' | 'secondary' | 'ghost'
}

const Button = (props: IProps): ReactNode => {
  const {
    children,
    onClick,
    fluid = false,
    size = 'm',
    disabled,
    type = 'button',
    color = 'primary',
  } = props

  const handleClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ): void => {
    if (type === 'button') {
      e.preventDefault()
    }
    if (onClick) {
      onClick()
    }
  }

  const buttonClassName = getUIClasses(
    styles.button,
    {
      fluid,
      size,
      additionalClasses: [commonStyles[color]],
    },
    commonStyles,
  )

  return (
    <button
      disabled={disabled}
      onClick={(e) => handleClick(e)}
      className={buttonClassName}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
