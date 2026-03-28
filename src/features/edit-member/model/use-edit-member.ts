import { TMemberFullSchema, useUpdateMemberMutation } from '@/entities/member'
import { transformToUpdateRequest } from '../lib/transform-to-update-request'
import { useMutationAction } from '@/shared/lib'

export const useEditMember = (id: number) => {
  return useMutationAction<TMemberFullSchema, { id: number; data: ReturnType<typeof transformToUpdateRequest> }>({
    mutation: useUpdateMemberMutation(),
    prepare: (formData) => ({ id, data: transformToUpdateRequest(formData) }),
    successMessage: 'Пользователь обновлён',
  })
}
