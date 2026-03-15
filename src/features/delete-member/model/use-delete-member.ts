import { useDeleteMemberMutation } from '@/entities/member'
import { getErrorMessage } from '@/shared/api'
import { toast } from 'sonner'

export const useDeleteMember = () => {
  const [deleteMember, { isLoading }] = useDeleteMemberMutation()

  const deleteMemberById = async (id: number) => {
    try {
      await deleteMember(id).unwrap()
      toast.info('Пользователь удалён')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }

  return { deleteMemberById, isLoading }
}
