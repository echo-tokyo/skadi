import { useGetMembersQuery } from '@/entities/member'
import { IMembersRequest } from '@/entities/member/model/types'

// FIXME: refactor: этот и подобный хук вынести в api
export const useGetMembers = (params: IMembersRequest) => {
  const { data, isLoading, error } = useGetMembersQuery(params)
  if (error) {
    console.log(error)
  }

  return { members: data, isLoading }
}
