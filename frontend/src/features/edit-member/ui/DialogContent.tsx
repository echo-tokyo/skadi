import { useClassSelectOptions } from '@/entities/class'
import {
  IMemberFieldsRef,
  memberBaseSchema,
  MemberFields,
  TMemberFullSchema,
} from '@/entities/member'
import { memo, Ref } from 'react'

interface IDialogContentProps {
  fieldData: TMemberFullSchema
  disabledFields: Array<keyof TMemberFullSchema>
  ref: Ref<IMemberFieldsRef>
  onDirtyChange?: (isDirty: boolean) => void
}

const DialogContent = (props: IDialogContentProps) => {
  const { ref: formRef, onDirtyChange, fieldData, disabledFields } = props

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
    options,
  } = useClassSelectOptions()

  return (
    <MemberFields
      ref={formRef}
      schema={memberBaseSchema}
      onDirtyChange={onDirtyChange}
      disabledFields={disabledFields}
      fieldData={fieldData}
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
