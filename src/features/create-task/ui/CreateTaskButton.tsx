import { Button } from '@/shared/ui'
import { memo } from 'react'
import { useFormContext } from 'react-hook-form'
import { TTaskCreateSchema } from '@/widgets/task-card'
import { useCreateTask } from '../model/use-create-task'

const CreateTaskButton = () => {
  const {
    watch,
    formState: { isDirty },
  } = useFormContext<TTaskCreateSchema>()

  const { submit } = useCreateTask()
  const fieldsData = watch()

  const handleClick = () => {
    if (isDirty) {
      submit(fieldsData)
    }
  }

  return <Button onClick={handleClick}>Создать задание</Button>
}

export default memo(CreateTaskButton)
