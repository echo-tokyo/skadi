import { IMembersRequest, useGetMembersQuery } from '@/entities/member'
import { getErrorMessage } from '@/shared/api'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useGetMembers = (params: IMembersRequest) => {
  const { data, isLoading, error, isError } = useGetMembersQuery(params)
  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error))
    }
  }, [error])

  return { members: data?.data ?? [], isLoading }
}
