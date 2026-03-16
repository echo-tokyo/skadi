import { TMemberFullSchema, useCreateMemberMutation } from '@/entities/member'
import { transformToRequest } from '../lib/transformToRequest'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'

export const useCreateMember = (): {
  submit: (formData: TMemberFullSchema) => Promise<boolean>
  isLoading: boolean
} => {
  const [createMember, { isLoading }] = useCreateMemberMutation()

  const submit = async (formData: TMemberFullSchema): Promise<boolean> => {
    try {
      await createMember(transformToRequest(formData)).unwrap()
      toast.info('Пользователь создан')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }

  return { submit, isLoading }
}
