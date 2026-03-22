import { useEffect, useRef } from 'react'

interface IInfiniteScrollProps {
  hasMore: boolean
  isFetchingNextPage: boolean
  loadMore: () => void
}

export const useInfiniteScroll = (props: IInfiniteScrollProps) => {
  const { hasMore, isFetchingNextPage, loadMore } = props
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          loadMore()
        }
      },
      { threshold: 0 },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isFetchingNextPage, loadMore])

  return { sentinelRef }
}
