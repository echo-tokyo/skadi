import { TClassSchema, useEditClassMutation } from '@/entities/class'
import { getErrorMessage } from '@/shared/api'
import { toast } from 'sonner'
import { transformToRequest } from '../lib/transform-to-request'

export const useEditClass = (id: number) => {
  const [editClass, { isLoading }] = useEditClassMutation()

  const updateClass = async (formData: TClassSchema): Promise<boolean> => {
    const data = transformToRequest(formData)
    try {
      await editClass({ id, data }).unwrap()
      toast.info('Группа обновлена')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }

  return { updateClass, isLoading }
}
