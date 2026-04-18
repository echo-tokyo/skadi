import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { TDisplayValues } from '../../model/types'

interface ITaskDescriptionSectionProps {
  displayValues: TDisplayValues
}

const TaskDescription = (props: ITaskDescriptionSectionProps) => {
  const { displayValues } = props
  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Описание
      </Text>
      <div className={styles.cardFields}>
        <Textarea
          label='Описание задания'
          fluid
          disabled
          value={displayValues.description}
          onChange={() => ''}
        />
      </div>
    </div>
  )
}

export default TaskDescription
