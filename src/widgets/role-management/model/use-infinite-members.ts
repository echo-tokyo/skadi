import { IMembersFilter, useGetMembersInfiniteQuery } from '@/entities/member'
import { getErrorMessage } from '@/shared/api'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useInfiniteMembers = (params: IMembersFilter) => {
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
    isError,
  } = useGetMembersInfiniteQuery(params)

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error))
    }
  }, [error, isError])

  const members = data?.pages.flatMap((page) => page.data) ?? []

  return {
    members,
    isFetchingNextPage,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  }
}
