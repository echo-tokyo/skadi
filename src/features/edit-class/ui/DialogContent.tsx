import { ClassFields, IClass, IClassFieldsRef } from '@/entities/class'
import { useMemberSelectOptions } from '@/entities/member'
import { memo, useMemo } from 'react'
import type { Ref } from 'react'
import { toFieldValues } from '../lib/to-field-values'
import type { SelectOption } from '@/shared/ui'

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
    onSearchChange: onStudentSearchChange,
  } = useMemberSelectOptions('student')
  const {
    options: teacherOptions,
    fetchNextPage: fetchNextTeachersPage,
    hasNextPage: hasNextTeachersPage,
    isFetchingNextPage: isFetchingNextTeachersPage,
    onSearchChange: onTeacherSearchChange,
  } = useMemberSelectOptions('teacher')

  const fieldValues = useMemo(() => toFieldValues(classData), [classData])

  const seedTeacherOptions = useMemo<SelectOption[]>(
    () =>
      classData.teacher
        ? [
            {
              value: String(classData.teacher.id),
              label: classData.teacher.fullname,
            },
          ]
        : [],
    [classData.teacher],
  )

  const seedStudentOptions = useMemo<SelectOption[]>(
    () =>
      classData.students?.map((s) => ({
        value: String(s.id),
        label: s.fullname,
      })) ?? [],
    [classData.students],
  )

  const mergedTeacherOptions = useMemo(() => {
    const fetchedIds = new Set(teacherOptions.map((o) => o.value))
    return [
      ...teacherOptions,
      ...seedTeacherOptions.filter((o) => !fetchedIds.has(o.value)),
    ]
  }, [teacherOptions, seedTeacherOptions])

  const mergedStudentOptions = useMemo(() => {
    const fetchedIds = new Set(studentOptions.map((o) => o.value))
    return [
      ...studentOptions,
      ...seedStudentOptions.filter((o) => !fetchedIds.has(o.value)),
    ]
  }, [studentOptions, seedStudentOptions])

  return (
    <ClassFields
      ref={classFieldsRef}
      fieldValues={fieldValues}
      onDirtyChange={onDirtyChange}
      teacherField={{
        data: mergedTeacherOptions,
        hasMore: hasNextTeachersPage,
        isLoadingMore: isFetchingNextTeachersPage,
        onLoadMore: fetchNextTeachersPage,
        onSearchChange: onTeacherSearchChange,
      }}
      studentField={{
        data: mergedStudentOptions,
        hasMore: hasNextStudentsPage,
        isLoadingMore: isFetchingNextStudentsPage,
        onLoadMore: fetchNextStudentsPage,
        onSearchChange: onStudentSearchChange,
      }}
    />
  )
}

export default memo(DialogContent)
