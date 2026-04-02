import { ITaskFieldsRef, TaskFields } from '@/entities/task'
import { useMemberSelectOptions } from '@/entities/member'
import { memo } from 'react'
import type { Ref } from 'react'

interface IDialogContentProps {
  ref: Ref<ITaskFieldsRef>
  onDirtyChange?: (isDirty: boolean) => void
}

const DialogContent = ({ ref, onDirtyChange }: IDialogContentProps) => {
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
