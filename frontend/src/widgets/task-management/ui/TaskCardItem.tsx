import { EditTaskButton } from '@/features/edit-task'
import { AccordionCard } from '@/shared/ui'
import { memo } from 'react'
import styles from './styles.module.scss'
import { TTask } from '@/shared/model'
import { DeleteTaskButton } from '@/features/delete-task'

interface ITaskCardItemProps {
  taskData: TTask
}

export const TaskCardItem = memo(({ taskData }: ITaskCardItemProps) => {
  return (
    <AccordionCard
      title={taskData.title}
      fields={[{ label: 'Описание', value: taskData.description }]}
      actions={
        <div className={styles.cardActions}>
          <DeleteTaskButton id={taskData.id} taskName={taskData.title} />
          <EditTaskButton task={taskData} />
        </div>
      }
    />
  )
})

TaskCardItem.displayName = 'TaskCardItem'
