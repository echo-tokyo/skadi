import { TTask } from '@/entities/task'
import { AccordionCard, Button } from '@/shared/ui'
import { memo } from 'react'
import { useNavigate } from 'react-router'
import styles from './styles.module.scss'

interface ITaskCardItemProps {
  taskData: TTask
}

export const TaskCardItem = memo(({ taskData }: ITaskCardItemProps) => {
  const nav = useNavigate()

  return (
    <AccordionCard
      title={taskData.title}
      fields={[
        { label: 'Описание', value: taskData.description },
        { label: 'Преподаватель', value: taskData.teacher?.fullname },
      ]}
      actions={
        <div className={styles.cardActions}>
          <Button color='inverted'>Удалить</Button>
          <Button
            color='secondary'
            onClick={() => nav(`/personal-area/tasks/${taskData.id}`)}
          >
            Редактировать
          </Button>
        </div>
      }
    />
  )
})

TaskCardItem.displayName = 'TaskCardItem'
