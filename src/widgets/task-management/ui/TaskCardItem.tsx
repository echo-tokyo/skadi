import { TaskCard, TTask } from '@/entities/task'
import { Button } from '@/shared/ui'
import { memo } from 'react'
import { useNavigate } from 'react-router'
import styles from './styles.module.scss'

interface ITaskCardItemProps {
  taskData: TTask
}

export const TaskCardItem = memo(({ taskData }: ITaskCardItemProps) => {
  const nav = useNavigate()

  return (
    <TaskCard
      title={taskData.title}
      description={taskData.description}
      teacherName={taskData.teacher?.fullname}
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
