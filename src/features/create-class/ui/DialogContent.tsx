import { ClassFields } from '@/entities/class'
import { useGetMembersInfiniteQuery } from '@/entities/member'
import { memo, useMemo } from 'react'

const DialogContent = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMembersInfiniteQuery({
      roles: ['teacher'],
      free: false,
      perPage: 5,
    })

  const teacherOptions = useMemo(
    () =>
      data?.pages
        .flatMap((el) => el.data)
        .map((el) => ({
          label: el.profile?.fullname as string,
          value: String(el.id),
        })) ?? [],
    [data],
  )

  return (
    <ClassFields
      teacherFieldData={teacherOptions}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  )
}

export default memo(DialogContent)
