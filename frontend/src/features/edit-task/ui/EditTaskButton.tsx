import { Button } from '@/shared/ui'
import { memo } from 'react'
import { useEditTaskDialog } from '../model/use-edit-task-dialog'
import { TTask } from '@/shared/model'

interface IEditTaskButtonProps {
  task: TTask
}

const EditTaskButton = ({ task }: IEditTaskButtonProps) => {
  const { showDialog } = useEditTaskDialog(task)
  return (
    <Button color='secondary' onClick={showDialog}>
      Редактировать
    </Button>
  )
}

export default memo(EditTaskButton)
