import { EditTaskButton } from '@/features/edit-task'
import { AccordionCard, Button } from '@/shared/ui'
import { memo } from 'react'
import styles from './styles.module.scss'
import { TTask } from '@/shared/model'

interface ITaskCardItemProps {
  taskData: TTask
}

export const TaskCardItem = memo(({ taskData }: ITaskCardItemProps) => {
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
          <EditTaskButton task={taskData} />
        </div>
      }
    />
  )
})

TaskCardItem.displayName = 'TaskCardItem'
