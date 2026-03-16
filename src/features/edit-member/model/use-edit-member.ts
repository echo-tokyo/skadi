import { TMemberFullSchema, useUpdateMemberMutation } from '@/entities/member'
import { getErrorMessage } from '@/shared/api'
import { toast } from 'sonner'
import { transformToUpdateRequest } from '../lib/transform-to-update-request'

export const useEditMember = (id: number) => {
  const [updateMember, { isLoading }] = useUpdateMemberMutation()

  const editMember = async (formData: TMemberFullSchema): Promise<boolean> => {
    const data = transformToUpdateRequest(formData)
    try {
      await updateMember({ id, data }).unwrap()
      toast.info('Пользователь обновлён')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }

  return { editMember, isLoading }
}
