import { ReactNode } from 'react'
import Button from '../../button/Button'
import Text from '../../text/Text'
import styles from '../styles/styles.module.scss'
import { TFile } from '@/shared/model/index'

interface IProps {
  file: TFile
  onRemove: (id: string) => void
}

const FileItem = ({ file, onRemove }: IProps): ReactNode => (
  <li className={styles.fileItem}>
    <Text className={styles.fileItemName} size='14'>
      {file.name}
    </Text>
    <Button type='icon' size='s' color='secondary' onClick={() => onRemove(file.id)}>
      <Text color='--color-gray' size='20'>
        ×
      </Text>
    </Button>
  </li>
)

FileItem.displayName = 'FileItem'
export default FileItem
