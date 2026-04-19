import { ITaskFieldsRef, TaskFields, TTaskSchema } from '@/entities/task'
import { useMemberSelectOptions } from '@/entities/member'
import { useClassSelectOptions } from '@/entities/class'
import { memo } from 'react'
import type { Ref } from 'react'

interface IDialogContentProps {
  ref: Ref<ITaskFieldsRef>
  fieldData: TTaskSchema
  onDirtyChange?: (isDirty: boolean) => void
}

const DialogContent = ({
  ref,
  fieldData,
  onDirtyChange,
}: IDialogContentProps) => {
  const {
    options,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
  } = useMemberSelectOptions('student', false)

  const {
    options: classOptions,
    fetchNextPage: classFetchNextPage,
    hasNextPage: classHasNextPage,
    isFetchingNextPage: classIsFetchingNextPage,
    onSearchChange: classOnSearchChange,
  } = useClassSelectOptions()

  // TODO: добавить selectedOptions после обновления бэка

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
      classField={{
        data: classOptions,
        hasMore: classHasNextPage,
        isLoadingMore: classIsFetchingNextPage,
        onLoadMore: classFetchNextPage,
        onSearchChange: classOnSearchChange,
      }}
    />
  )
}

export default memo(DialogContent)
