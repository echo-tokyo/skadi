import { ClassFields, IClass, IClassFieldsRef } from '@/entities/class'
import { useMemberSelectOptions } from '@/entities/member'
import { memo, useMemo } from 'react'
import type { Ref } from 'react'
import { toFieldValues } from '../lib/to-field-values'

interface DialogContentProps {
  classData: IClass
  classFieldsRef: Ref<IClassFieldsRef>
  onDirtyChange: (isDirty: boolean) => void
}

const DialogContent = (props: DialogContentProps) => {
  const { classFieldsRef, onDirtyChange, classData } = props
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

  // FIXME: если выбранных id нет в первой пачке teacherOptions или studentOptions, то значения не отобразится до тех пор, пока не придут те пачки данных, в которых есть эти id
  const fieldValues = useMemo(() => toFieldValues(classData), [classData])

  return (
    <ClassFields
      ref={classFieldsRef}
      fieldValues={fieldValues}
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
