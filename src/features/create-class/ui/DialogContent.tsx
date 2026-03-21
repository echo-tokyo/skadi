import { ClassFields } from '@/entities/class'
import { useGetMembersInfiniteQuery } from '@/entities/member'
import { memo, useMemo } from 'react'

const DialogContent = () => {
  const {
    data: teachersData,
    fetchNextPage: fetchNextTeachersPage,
    hasNextPage: hasNextTeachersPage,
    isFetchingNextPage: isFetchingNextTeachersPage,
  } = useGetMembersInfiniteQuery({
    roles: ['teacher'],
    free: false,
    perPage: 5,
  })

  const {
    data: studentsData,
    fetchNextPage: fetchNextStudentsPage,
    hasNextPage: hasNextStudentsPage,
    isFetchingNextPage: isFetchingNextStudentsPage,
  } = useGetMembersInfiniteQuery({
    roles: ['student'],
    free: false,
    perPage: 5,
  })

  const teacherOptions = useMemo(
    () =>
      teachersData?.pages
        .flatMap((el) => el.data)
        .map((el) => ({
          label: el.profile?.fullname as string,
          value: String(el.id),
        })) ?? [],
    [teachersData],
  )

  const studentOptions = useMemo(
    () =>
      studentsData?.pages
        .flatMap((el) => el.data)
        .map((el) => ({
          label: el.profile?.fullname as string,
          value: String(el.id),
        })) ?? [],
    [studentsData],
  )

  return (
    <ClassFields
      teacherField={{
        data: teacherOptions,
        hasMore: hasNextTeachersPage,
        isLoadingMore: isFetchingNextTeachersPage,
        onLoadMore: fetchNextTeachersPage,
      }}
      studentField={{
        data: studentOptions,
        hasMore: hasNextStudentsPage,
        isLoadingMore: isFetchingNextStudentsPage,
        onLoadMore: fetchNextStudentsPage,
      }}
    />
  )
}

export default memo(DialogContent)
