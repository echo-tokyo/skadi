import { Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { TDisplayValues } from '../../model/types'
import { FileDownload } from '@/features/file-download'

interface ITaskMaterialsProps {
  displayValues: TDisplayValues
}

const TaskMaterials = (props: ITaskMaterialsProps) => {
  const { displayValues } = props
  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Материалы
      </Text>
      <div className={styles.cardMaterialsFields}>
        {displayValues.files.length > 0 ? (
          displayValues.files.map((el) => <FileDownload key={el.id} el={el} />)
        ) : (
          <Text>Пока пусто 🥲</Text>
        )}
      </div>
    </div>
  )
}

export default TaskMaterials
