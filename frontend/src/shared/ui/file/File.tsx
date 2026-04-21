import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  DragEvent,
  ChangeEvent,
  KeyboardEvent,
} from 'react'
import styles from './styles.module.scss'
import commonStyles from '../styles/common.module.scss'
import { getUIClasses } from '@/shared/lib/classNames/getUIClasses'
import Text from '../text/Text'
import Button from '../button/Button'

interface IProps {
  title?: string
  description?: string
  fluid?: boolean
  size?: 's' | 'm'
  disabled?: boolean
  isValid?: boolean
  required?: boolean
  accept?: string
  multiple?: boolean
  onChange: (files: File[]) => void
}

const File = ({
  title,
  description,
  fluid,
  size = 'm',
  disabled,
  isValid = true,
  required,
  accept,
  multiple,
  onChange,
}: IProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChange(files)
  }, [files])

  const handleFiles = (incoming: FileList | null): void => {
    if (!incoming || incoming.length === 0) return
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [
        ...prev,
        ...Array.from(incoming).filter((f) => !names.has(f.name)),
      ]
    })
  }

  const handleRemove = (fileName: string): void => {
    if (inputRef.current) inputRef.current.value = ''
    setFiles((prev) => prev.filter((f) => f.name !== fileName))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    handleFiles(e.target.files)
  }

  const handleClick = (): void => {
    if (!disabled) inputRef.current?.click()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const wrapperClassName = getUIClasses(
    styles.wrapper,
    { fluid, additionalClasses: isValid ? [] : [commonStyles.invalidText] },
    commonStyles,
  )

  const dropzoneClassName = getUIClasses(
    styles.dropzone,
    {
      size,
      additionalClasses: [
        isDragging ? styles.dropzone_dragging : '',
        !isValid ? commonStyles.invalid : '',
        disabled ? styles.dropzone_disabled : '',
      ].filter(Boolean),
    },
    styles,
  )

  return (
    <div className={wrapperClassName}>
      {title && (
        <label className={styles.title}>
          {title}
          {required && (
            <span className={styles.required} aria-label='обязательное поле'>
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        required={required}
        aria-invalid={!isValid}
        aria-required={required}
        className={styles.input_hidden}
        onChange={handleChange}
      />

      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        className={dropzoneClassName}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Text size='12' color='--color-gray'>
          {files.length > 0 ? 'Изменить файлы' : 'Выберите файл'}
        </Text>
        <Text size='12' color='--color-gray'>
          или перетащите сюда
        </Text>
      </div>

      {files.length > 0 && (
        <ul className={styles.file_list} aria-label='Выбранные файлы'>
          {files.map((file) => (
            <li key={file.name} className={styles.file_item}>
              <Text className={styles.file_item_name} size='14'>
                {file.name}
              </Text>
              <Button
                type='icon'
                size='s'
                color='secondary'
                onClick={() => handleRemove(file.name)}
              >
                <Text color='--color-gray' size='20'>
                  ×
                </Text>
              </Button>
            </li>
          ))}
        </ul>
      )}

      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}

File.displayName = 'File'
export default File
