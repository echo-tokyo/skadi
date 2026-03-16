import { useRef, useMemo } from 'react'
import { useDialog } from '@/shared/lib'
import {
  MemberForm,
  IMemberFormRef,
  IMember,
  memberBaseSchema,
  BASE_DISABLED_FIELDS,
} from '@/entities/member'
import { toFormData } from '../lib/to-form-data'
import { useEditMember } from './use-edit-member'

export const useEditMemberDialog = (member: IMember) => {
  const showDialog = useDialog()
  const formRef = useRef<IMemberFormRef>(null)
  const { editMember } = useEditMember(member.id)
  const fieldData = useMemo(() => toFormData(member), [member])

  const show = () => {
    showDialog({
      title: 'Редактирование пользователя',
      content: (
        <MemberForm
          ref={formRef}
          schema={memberBaseSchema}
          fieldData={fieldData}
          disabledFields={BASE_DISABLED_FIELDS}
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

        const formData = formRef.current?.getFormData()

        if (formData) {
          const success = await editMember(formData)
          if (!success) {
            throw new Error('Failed to update member')
          }
        }

        formRef.current?.reset()
      },
    })
  }

  return { show }
}
