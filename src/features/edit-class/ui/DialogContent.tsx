import { ClassFields, IClass, IClassFieldsRef } from '@/entities/class'
import { useGetMembersInfiniteQuery } from '@/entities/member'
import { memo, useMemo } from 'react'
import type { Ref } from 'react'
import { toFieldValues } from '../lib/to-field-values'

interface DialogContentProps {
  classData: IClass
  classFieldsRef: Ref<IClassFieldsRef>
  onDirtyChange: (isDirty: boolean) => void
}

// FIXME: точно такой же код практически в фиче create class
const DialogContent = (props: DialogContentProps) => {
  const { classFieldsRef, onDirtyChange, classData } = props

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

  // FIXME: если выбранных id нет в первой пачке teacherOptions или studentOptions, то значения не отобразится до тех пор, пока не придут те пачки данных, в которых есть эти id
  const fieldData = toFieldValues(classData)

  return (
    <ClassFields
      ref={classFieldsRef}
      fieldValues={fieldData}
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
