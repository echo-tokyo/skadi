import { Text } from '@/shared/ui'
import styles from '../styles.module.scss'

const TaskMaterials = () => {
  return (
    <div className={styles.card}>
      <Text size='20' weight='bold'>
        Материалы
      </Text>
      <div className={styles.cardFields}>
        {/* TODO: пока что бэк не готов под файлы и нет компонента под это на фронте */}
        <Text>Пока пусто 🥲</Text>
      </div>
    </div>
  )
}

export default TaskMaterials
