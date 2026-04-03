import { Button } from '@/shared/ui'
import { TSolutionTeacherSchema } from '@/widgets/task-card'
import { useFormContext } from 'react-hook-form'
import { useUpdateTask } from '../model/use-update-solution'

const UpdateSolutionButton = ({ id }: { id: number }) => {
  const {
    watch,
    formState: { isDirty },
  } = useFormContext<TSolutionTeacherSchema>()

  const { submit } = useUpdateTask(id)
  const fieldsData = watch()

  return (
    <Button disabled={!isDirty} onClick={() => submit(fieldsData)}>
      {fieldsData.status === '4' ? 'Одобрить выполнение' : 'Сохранить решение'}
    </Button>
  )
}

export default UpdateSolutionButton
