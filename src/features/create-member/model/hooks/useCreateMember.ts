import { useCreateMemberMutation } from '@/entities/member'
import { CreateMemberFormData } from '../types'
import { transformToRequest } from '../../lib/transformToRequest'

export const useCreateMember = (): {
  submit: (formData: CreateMemberFormData) => Promise<boolean>
  isLoading: boolean
} => {
  const [createMember, { isLoading }] = useCreateMemberMutation()

  const submit = async (formData: CreateMemberFormData): Promise<boolean> => {
    try {
      await createMember(transformToRequest(formData)).unwrap()
      return true
    } catch {
      return false
    }
  }

  return { submit, isLoading }
}
