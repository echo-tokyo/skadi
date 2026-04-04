import { Button } from '@/shared/ui'
import { useFormContext } from 'react-hook-form'
import { TSolutionStudentSchema } from '@/entities/solution'
import { useStudentUpdateSolution } from '../../model/use-student-update-solution'

// FIXME: isDirty после сохранения становится неактульным
const UpdateSolutionByStudentButton = ({ id }: { id: number }) => {
  const {
    watch,
    handleSubmit,
    formState: { isDirty },
  } = useFormContext<TSolutionStudentSchema>()

  const { submit } = useStudentUpdateSolution(id)
  const statusValue = watch('status')

  return (
    <Button disabled={!isDirty} onClick={handleSubmit(submit)}>
      {statusValue === '3' ? 'Отправить на проверку' : 'Сохранить решение'}
    </Button>
  )
}

export default UpdateSolutionByStudentButton
