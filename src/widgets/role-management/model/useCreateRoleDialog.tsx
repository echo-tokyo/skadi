import { useDialog } from '@/shared/lib'
import CreateRoleDialog from '../ui/dialogs/CreateRoleDialog'

export const useCreateRoleDialog = (): { show: () => void } => {
  const showDialog = useDialog()

  const show = (): void => {
    showDialog({
      title: 'Создание роли',
      content: <CreateRoleDialog />,
      positiveText: 'Создать',
      negativeText: 'Отмена',
      onConfirm: async () => console.log('confirm'),
      onClose: () => console.log('close'),
    })
  }

  return { show }
}
