import { Button } from '@/shared/ui'
import { memo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useUpdateTask } from '../model/use-update-task'
import { TTaskSchema } from '@/widgets/task-card'

interface IUpdateTaskButtonProps {
  id: number
}

const UpdateTaskButton = ({ id }: IUpdateTaskButtonProps) => {
  const {
    watch,
    formState: { isDirty },
  } = useFormContext<TTaskSchema>()

  const { submit } = useUpdateTask(id)
  const fieldsData = watch()

  const handleClick = () => {
    if (isDirty) {
      submit(fieldsData)
    }
  }

  return <Button onClick={handleClick}>Сохранить задание</Button>
}

export default memo(UpdateTaskButton)
