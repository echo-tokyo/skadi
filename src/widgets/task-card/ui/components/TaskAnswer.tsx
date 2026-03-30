import { Text } from '@/shared/ui'
import styles from '../styles.module.scss'

const TaskAnswer = () => {
  return (
    <div className={styles.cardAnswer}>
      <Text size='20' weight='bold'>
        Ответ
      </Text>
      <div className={styles.cardFields}>
        <Text>Пока пусто 🥲</Text>
      </div>
    </div>
  )
}

export default TaskAnswer
