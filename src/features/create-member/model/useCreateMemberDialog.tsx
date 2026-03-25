import { useRef } from 'react'
import { useDialog } from '@/shared/lib'
import {
  memberFullSchema,
  MemberFields,
  IMemberFieldsRef,
} from '@/entities/member'
import { useCreateMember } from './use-create-member'

export const useCreateMemberDialog = () => {
  const { show, update } = useDialog()
  const { submit } = useCreateMember()
  const formRef = useRef<IMemberFieldsRef>(null)
  const dialogIdRef = useRef<string | null>(null)

  const showDialog = (): void => {
    const id = show({
      title: 'Создание пользователя',
      content: () => (
        <MemberFields
          ref={formRef}
          schema={memberFullSchema}
          onDirtyChange={(isDirty) => {
            if (dialogIdRef.current) {
              update(dialogIdRef.current, { isConfirmDisabled: !isDirty })
            }
          }}
        />
      ),
      positiveText: 'Создать',
      negativeText: 'Отмена',
      size: 'm',
      isConfirmDisabled: true,
      onConfirm: async () => {
        const isValid = await formRef.current?.validate()

        if (!isValid) {
          throw new Error('Validation failed')
        }

        const formData = formRef.current?.getFieldsData()

        if (formData) {
          const success = await submit(formData)
          if (!success) {
            throw new Error('Failed to create member')
          }
        }
      },
    })

    dialogIdRef.current = id
  }

  return { showDialog }
}
