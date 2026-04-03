import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { TDisplayValues } from '../../model/types'

interface ITaskDescriptionSectionProps {
  taskValues: TDisplayValues
}

const TaskDescription = (props: ITaskDescriptionSectionProps) => {
  const { taskValues } = props
  return (
    <div className={styles.card}>
      <Text size='20' weight='bold'>
        Описание
      </Text>
      <div className={styles.cardFields}>
        <Textarea
          label='Описание задания'
          fluid
          disabled
          value={taskValues.description}
          onChange={() => ''}
        />
      </div>
    </div>
  )
}

export default TaskDescription
