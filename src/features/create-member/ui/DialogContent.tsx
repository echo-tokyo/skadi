import { useClassSelectOptions } from '@/entities/class'
import {
  IMemberFieldsRef,
  MemberFields,
  memberFullSchema,
} from '@/entities/member'
import { memo, Ref } from 'react'

interface IDialogContentProps {
  ref: Ref<IMemberFieldsRef>
  onDirtyChange?: (isDirty: boolean) => void
}

const DialogContent = (props: IDialogContentProps) => {
  const { ref: formRef, onDirtyChange } = props

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
    options,
  } = useClassSelectOptions()

  console.log('DialogContent')

  return (
    <MemberFields
      ref={formRef}
      schema={memberFullSchema}
      onDirtyChange={onDirtyChange}
      classField={{
        data: options,
        onSearchChange,
        hasMore: hasNextPage,
        isLoadingMore: isFetchingNextPage,
        onLoadMore: fetchNextPage,
      }}
    />
  )
}

export default memo(DialogContent)
