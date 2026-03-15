import { useCreateMemberMutation } from '@/entities/member'
import { transformToRequest } from '../../lib/transformToRequest'
import { TCreateMemberFormData } from '../schemas'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'

export const useCreateMember = (): {
  submit: (formData: TCreateMemberFormData) => Promise<boolean>
  isLoading: boolean
} => {
  const [createMember, { isLoading, error }] = useCreateMemberMutation()

  const submit = async (formData: TCreateMemberFormData): Promise<boolean> => {
    try {
      await createMember(transformToRequest(formData)).unwrap()
      toast.info('Пользователь создан')
      return true
    } catch {
      toast.error(getErrorMessage(error))
      return false
    }
  }

  return { submit, isLoading }
}
