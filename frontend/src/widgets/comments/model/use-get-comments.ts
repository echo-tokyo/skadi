import { useGetCommentsInfiniteQuery } from '@/entities/comment'
import { getErrorMessage } from '@/shared/api'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useGetComments = ({ id }: { id: number }) => {
  const {
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
    isError,
    isLoading,
  } = useGetCommentsInfiniteQuery({ id })

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error))
    }
  }, [error, isError])

  return {
    isFetchingNextPage,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoading,
  }
}
