import { useClassSelectOptions } from '@/entities/class'
import {
  IMemberFieldsRef,
  MemberFields,
  memberFullSchema,
  TMemberFullSchema,
} from '@/entities/member'
import { memo, Ref } from 'react'
import { ZodObject, ZodRawShape } from 'zod'

interface IDialogContentProps {
  schema: ZodObject<ZodRawShape>
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
      schema={memberFullSchema}
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
