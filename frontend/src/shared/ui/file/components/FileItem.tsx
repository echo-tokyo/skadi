import { ReactNode } from 'react'
import Button from '../../button/Button'
import Text from '../../text/Text'
import styles from '../styles/styles.module.scss'
import { FileDisplayItem } from '../types/types'

interface IProps {
  file: FileDisplayItem
  onRemove: (id: string) => void
}

const FileItem = ({ file, onRemove }: IProps): ReactNode => (
  <li className={styles.fileItem}>
    <Text className={styles.fileItemName} size='14'>
      {file.name}
    </Text>
    <Button
      type='icon'
      size='s'
      color='secondary'
      aria-label={`Удалить файл ${file.name}`}
      onClick={() => onRemove(file.id)}
    >
      <Text color='--color-gray' size='20'>
        ×
      </Text>
    </Button>
  </li>
)

FileItem.displayName = 'FileItem'
export default FileItem
