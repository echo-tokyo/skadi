import { ReactNode, ChangeEvent } from 'react'
import styles from './styles.module.scss'
import commonStyles from '../styles/common.module.scss'
import { getUIClasses } from '@/shared/lib'

interface IProps {
  value: string
  title?: string
  placeholder?: string
  fluid?: boolean
  size?: 's' | 'm'
  disabled?: boolean
  type?: 'text' | 'password'
  onChange: (value: string) => void
}

const Input = (props: IProps): ReactNode => {
  const {
    placeholder = 'Ввод...',
    title = 'Введите значение',
    value,
    disabled,
    type = 'text',
    fluid,
    size = 'm',
    onChange,
  } = props

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value)
  }

  const wrapperClassName = getUIClasses(styles.wrapper, { fluid }, commonStyles)

  const inputClassName = getUIClasses(
    styles.input,
    { size, fluid },
    commonStyles,
  )

  return (
    <div className={wrapperClassName}>
      {title && <p className={styles.input_title}>{title}</p>}
      <input
        value={value}
        type={type}
        disabled={disabled}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  )
}

export default Input
