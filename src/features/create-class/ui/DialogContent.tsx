import { ClassFields, IClassFieldsRef } from '@/entities/class'
import { useGetMembersInfiniteQuery } from '@/entities/member'
import { memo, useMemo } from 'react'
import type { Ref } from 'react'

interface DialogContentProps {
  classFieldsRef: Ref<IClassFieldsRef>
  onDirtyChange: (isDirty: boolean) => void
}

const DialogContent = (props: DialogContentProps) => {
  const { classFieldsRef, onDirtyChange } = props

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
      ref={classFieldsRef}
      onDirtyChange={onDirtyChange}
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
