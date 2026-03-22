import { useDeleteClassMutation } from '@/entities/class'
import { getErrorMessage } from '@/shared/api'
import { toast } from 'sonner'

export const useDeleteClass = () => {
  const [deleteClass, { isLoading }] = useDeleteClassMutation()

  const deleteClassById = async (id: number) => {
    try {
      await deleteClass(id).unwrap()
      toast.info('Группа удалена')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }

  return { deleteClassById, isLoading }
}
