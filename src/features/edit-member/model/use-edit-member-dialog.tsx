import { useRef, useMemo } from 'react'
import { useDialog } from '@/shared/lib'
import {
  IMember,
  memberBaseSchema,
  BASE_DISABLED_FIELDS,
  MemberFields,
  IMemberFieldsRef,
} from '@/entities/member'
import { toFormData } from '../lib/to-form-data'
import { useEditMember } from './use-edit-member'

export const useEditMemberDialog = (member: IMember) => {
  const { show, update } = useDialog()
  const formRef = useRef<IMemberFieldsRef>(null)
  const { editMember } = useEditMember(member.id)
  const fieldData = useMemo(() => toFormData(member), [member])
  const dialogIdRef = useRef<string | null>(null)

  const showDialog = () => {
    const id = show({
      title: 'Редактирование пользователя',
      content: (
        <MemberFields
          ref={formRef}
          schema={memberBaseSchema}
          fieldData={fieldData}
          disabledFields={BASE_DISABLED_FIELDS}
          onDirtyChange={(isDirty) => {
            if (dialogIdRef.current) {
              update(dialogIdRef.current, {
                isConfirmDisabled: !isDirty,
              })
            }
          }}
        />
      ),
      positiveText: 'Сохранить',
      negativeText: 'Отмена',
      size: 'm',
      onConfirm: async () => {
        const isValid = await formRef.current?.validate()

        if (!isValid) {
          throw new Error('Validation failed')
        }

        const formData = formRef.current?.getFieldsData()

        if (formData) {
          const success = await editMember(formData)
          if (!success) {
            throw new Error('Failed to update member')
          }
        }
      },
    })
    dialogIdRef.current = id
  }

  return { showDialog }
}
