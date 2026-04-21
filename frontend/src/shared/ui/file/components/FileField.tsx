import { ReactNode, useState } from 'react'
import styles from '../styles/styles.module.scss'
import commonStyles from '../../styles/common.module.scss'
import { getUIClasses } from '@/shared/lib/classNames/getUIClasses'
import { TFile } from '@/shared/model/index'
import Dropzone from './Dropzone'
import FileItem from './FileItem'

export interface ILocalFile extends TFile {
  file: File
}

interface IProps {
  title?: string
  description?: string
  serverFiles?: TFile[]
  fluid?: boolean
  size?: 's' | 'm'
  disabled?: boolean
  isValid?: boolean
  required?: boolean
  accept?: string
  multiple?: boolean
  onNewFilesChange: (files: File[]) => void
  onRemoveServerFile?: (id: string) => void
}

const FileField = ({
  title,
  description,
  serverFiles = [],
  fluid,
  size = 'm',
  disabled,
  isValid = true,
  required,
  accept,
  multiple,
  onNewFilesChange,
  onRemoveServerFile,
}: IProps): ReactNode => {
  const [localFiles, setLocalFiles] = useState<ILocalFile[]>([])

  const handleFiles = (incoming: FileList): void => {
    const existingNames = new Set([
      ...serverFiles.map((f) => f.name),
      ...localFiles.map((f) => f.name),
    ])

    const added: ILocalFile[] = Array.from(incoming)
      .filter((f) => !existingNames.has(f.name))
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        type: f.type,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
        file: f,
      }))

    if (added.length === 0) return

    const next = [...localFiles, ...added]
    setLocalFiles(next)
    onNewFilesChange(next.map((f) => f.file))
  }

  const handleRemoveLocal = (id: string): void => {
    const next = localFiles.filter((f) => f.id !== id)
    setLocalFiles(next)
    onNewFilesChange(next.map((f) => f.file))
  }

  const totalCount = serverFiles.length + localFiles.length

  const wrapperClassName = getUIClasses(
    styles.wrapper,
    { fluid, additionalClasses: isValid ? [] : [commonStyles.invalidText] },
    commonStyles,
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

      <Dropzone
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        isValid={isValid}
        size={size}
        hasFiles={totalCount > 0}
        onFiles={handleFiles}
      />

      {totalCount > 0 && (
        <ul className={styles.fileList} aria-label='Выбранные файлы'>
          {serverFiles.map((file) => (
            <FileItem key={file.id} file={file} onRemove={(id) => onRemoveServerFile?.(id)} />
          ))}
          {localFiles.map((file) => (
            <FileItem key={file.id} file={file} onRemove={handleRemoveLocal} />
          ))}
        </ul>
      )}

      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}

FileField.displayName = 'FileField'
export default FileField
