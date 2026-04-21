import { ReactNode, ChangeEvent, useId } from 'react'
import type { Ref } from 'react'
import styles from './styles.module.scss'
import commonStyles from '../styles/common.module.scss'
import { getUIClasses } from '@/shared/lib/classNames/getUIClasses'

interface IProps {
  ref?: Ref<HTMLInputElement>
  value: string
  title?: string
  description?: string
  placeholder?: string
  fluid?: boolean
  size?: 's' | 'm'
  disabled?: boolean
  isValid?: boolean
  type?: 'text' | 'password'
  required?: boolean
  onChange: (value: string) => void
}

const Input = ({
  ref,
  placeholder = 'Ввод...',
  title,
  value,
  disabled,
  isValid = true,
  description,
  type = 'text',
  fluid,
  size = 'm',
  required,
  onChange,
}: IProps): ReactNode => {
  const inputId = useId()
  const descriptionId = `${inputId}-description`

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value)
  }

  const wrapperClassName = getUIClasses(
    styles.wrapper,
    { fluid, additionalClasses: isValid ? [] : [commonStyles.invalidText] },
    commonStyles,
  )

  const inputClassName = getUIClasses(
    styles.input,
    { size, fluid, additionalClasses: isValid ? [] : [commonStyles.invalid] },
    commonStyles,
  )

  return (
    <div className={wrapperClassName}>
      {title && (
        <label htmlFor={inputId} className={styles.inputTitle}>
          {title}
          {required && (
            <span className={styles.required} aria-label='обязательное поле'>
              *
            </span>
          )}
        </label>
      )}
      <input
        autoComplete='off'
        ref={ref}
        id={inputId}
        value={value}
        type={type}
        disabled={disabled}
        required={required}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClassName}
        aria-invalid={!isValid}
        aria-describedby={description ? descriptionId : undefined}
        aria-required={required}
      />
      {description && (
        <p id={descriptionId} className={styles.inputDescription}>
          {description}
        </p>
      )}
    </div>
  )
}

Input.displayName = 'Input'

export default Input
