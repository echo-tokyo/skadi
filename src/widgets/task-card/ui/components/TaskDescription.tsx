import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { useFormContext } from 'react-hook-form'

const TaskDescription = () => {
  const { watch, setValue } = useFormContext()
  const fieldsData = watch()

  return (
    <div className={styles.card}>
      <Text size='20' weight='bold'>
        Описание
      </Text>
      <div className={styles.cardFields}>
        <Textarea
          label='Описание задания'
          fluid
          value={fieldsData.description}
          onChange={(v) => setValue('description', v)}
        />
      </div>
    </div>
  )
}

export default TaskDescription
