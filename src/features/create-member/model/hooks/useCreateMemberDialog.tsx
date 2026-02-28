import { useRef } from 'react'
import { useDialog } from '@/shared/lib'
import CreateMemberDialog, {
  CreateMemberDialogRef,
} from '../../ui/CreateMemberDialog'
import { transformToRequest } from '../../lib/transformToRequest'

export const useCreateMemberDialog = (): { show: () => void } => {
  const showDialog = useDialog()
  // const { submit } = useCreateMember()
  const formRef = useRef<CreateMemberDialogRef>(null)

  const show = (): void => {
    showDialog({
      title: 'Создание пользователя',
      content: <CreateMemberDialog ref={formRef} />,
      positiveText: 'Создать',
      negativeText: 'Отмена',
      onConfirm: async () => {
        if (!formRef.current) {
          return
        }

        console.log(formRef.current.getFormData())
        console.log(transformToRequest(formRef.current.getFormData()))

        // закоменчено до появления валидации полей
        // const formData = formRef.current.getFormData()
        // const success = await submit(formData)

        // if (!success) {
        //   throw new Error('Failed to create member')
        // }

        formRef.current.reset()
      },
      onClose: () => {},
    })
  }

  return { show }
}
