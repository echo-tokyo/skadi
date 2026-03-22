import { useGetClassesInfiniteQuery } from '@/entities/class'
import { IClassQuery } from '@/entities/class/model/types'
import { getErrorMessage } from '@/shared/api'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useInfiniteClasses = (params: IClassQuery) => {
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
    isError,
  } = useGetClassesInfiniteQuery(params)

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error))
    }
  }, [error, isError])

  const classes = data?.pages.flatMap((page) => page.data) ?? []

  return {
    classes,
    isFetchingNextPage,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  }
}
