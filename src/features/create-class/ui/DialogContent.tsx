import { ClassFields, IClassFieldsRef } from '@/entities/class'
import { useMemberSelectOptions } from '@/entities/member'
import { memo } from 'react'
import type { Ref } from 'react'

interface DialogContentProps {
  classFieldsRef: Ref<IClassFieldsRef>
  onDirtyChange: (isDirty: boolean) => void
}

const DialogContent = (props: DialogContentProps) => {
  const { classFieldsRef, onDirtyChange } = props

  const {
    options: studentOptions,
    fetchNextPage: fetchNextStudentsPage,
    hasNextPage: hasNextStudentsPage,
    isFetchingNextPage: isFetchingNextStudentsPage,
  } = useMemberSelectOptions('student')
  const {
    options: teacherOptions,
    fetchNextPage: fetchNextTeachersPage,
    hasNextPage: hasNextTeachersPage,
    isFetchingNextPage: isFetchingNextTeachersPage,
  } = useMemberSelectOptions('teacher')

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
