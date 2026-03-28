import { ReactNode, ChangeEvent, forwardRef, useId } from 'react'
import styles from './styles.module.scss'
import commonStyles from '../styles/common.module.scss'
import { getUIClasses } from '@/shared/lib/classNames/getUIClasses'

interface IProps {
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

const Input = forwardRef<HTMLInputElement, IProps>((props, ref): ReactNode => {
  const {
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
  } = props

  const generatedId = useId()
  const inputId = generatedId
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
        <label htmlFor={inputId} className={styles.input_title}>
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
        <p id={descriptionId} className={styles.input_description}>
          {description}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
