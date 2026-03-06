import { useRef } from 'react'
import { useDialog } from '@/shared/lib'
import CreateMemberDialog, {
  ICreateMemberDialogRef,
} from '../../ui/CreateMemberDialog'
import { useCreateMember } from './use-create-member'

export const useCreateMemberDialog = (): { show: () => void } => {
  const showDialog = useDialog()
  const { submit } = useCreateMember()
  const formRef = useRef<ICreateMemberDialogRef>(null)

  const show = (): void => {
    showDialog({
      title: 'Создание пользователя',
      content: <CreateMemberDialog ref={formRef} />,
      positiveText: 'Создать',
      negativeText: 'Отмена',
      size: 'm',
      onConfirm: async () => {
        const isValid = await formRef.current?.validate()

        if (!isValid) {
          throw new Error('Validation failed')
        }

        const formData = formRef.current?.getFormData()

        if (formData) {
          const success = await submit(formData)
          if (!success) {
            throw new Error('Failed to create member')
          }
        }

        formRef.current?.reset()
      },
    })
  }

  return { show }
}
