import { useGetMembersQuery } from '@/entities/member'
import { IMembersRequest } from '@/entities/member/model/types'
import { getErrorMessage } from '@/shared/api'
import { toast } from 'sonner'

export const useGetMembers = (params: IMembersRequest) => {
  const { data, isLoading, error } = useGetMembersQuery(params)
  if (error) {
    toast.error(getErrorMessage(error))
  }

  return { members: data, isLoading }
}
