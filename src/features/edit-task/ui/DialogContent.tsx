import { ITaskFieldsRef, TaskFields } from '@/entities/task'
import { TTaskSchema } from '@/entities/task/model/schema'
import { useMemberSelectOptions } from '@/entities/member'
import { memo } from 'react'
import type { Ref } from 'react'

interface IDialogContentProps {
  ref: Ref<ITaskFieldsRef>
  fieldData: TTaskSchema
  onDirtyChange?: (isDirty: boolean) => void
}

const DialogContent = ({ ref, fieldData, onDirtyChange }: IDialogContentProps) => {
  const {
    options,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
  } = useMemberSelectOptions('student')

  return (
    <TaskFields
      ref={ref}
      fieldData={fieldData}
      onDirtyChange={onDirtyChange}
      studentField={{
        data: options,
        hasMore: hasNextPage,
        isLoadingMore: isFetchingNextPage,
        onLoadMore: fetchNextPage,
        onSearchChange,
      }}
    />
  )
}

export default memo(DialogContent)
