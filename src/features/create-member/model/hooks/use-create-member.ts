import { useCreateMemberMutation } from '@/entities/member'
import { transformToRequest } from '../../lib/transformToRequest'
import { TCreateMemberFormData } from '../schemas'

export const useCreateMember = (): {
  submit: (formData: TCreateMemberFormData) => Promise<boolean>
  isLoading: boolean
} => {
  const [createMember, { isLoading }] = useCreateMemberMutation()

  const submit = async (formData: TCreateMemberFormData): Promise<boolean> => {
    try {
      await createMember(transformToRequest(formData)).unwrap()
      return true
    } catch {
      return false
    }
  }

  return { submit, isLoading }
}
