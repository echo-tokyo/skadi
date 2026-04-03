import { Button } from '@/shared/ui'
import { useFormContext } from 'react-hook-form'
import { TSolutionTeacherSchema } from '@/entities/solution'
import { useUpdateSolution } from '../model/use-update-solution'

// FIXME: isDirty после сохранения становится неактульным
const UpdateSolutionByTeacherButton = ({ id }: { id: number }) => {
  const {
    watch,
    handleSubmit,
    formState: { isDirty },
  } = useFormContext<TSolutionTeacherSchema>()

  const { submit } = useUpdateSolution(id)
  const statusValue = watch('status')

  return (
    <Button disabled={!isDirty} onClick={handleSubmit(submit)}>
      {statusValue === '4' ? 'Одобрить выполнение' : 'Сохранить решение'}
    </Button>
  )
}

export default UpdateSolutionByTeacherButton
