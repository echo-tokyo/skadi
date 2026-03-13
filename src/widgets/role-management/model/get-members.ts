import { useGetMembersQuery } from '@/entities/member'
import { IMembersRequest } from '@/entities/member/model/types'
import { getErrorMessage } from '@/shared/api'
import { toast } from 'sonner'

export const useGetMembers = (params: IMembersRequest) => {
  const { data, isLoading, error, isError } = useGetMembersQuery(params)
  if (isError) {
    toast.error(getErrorMessage(error))
  }

  return { members: data?.data ?? [], isLoading }
}
