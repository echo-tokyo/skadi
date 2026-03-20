import { useDialog } from '@/shared/lib'
import DialogContent from '../ui/DialogContent'

export const useCreateClassDialog = () => {
  const { show } = useDialog()

  const showDialog = (): void => {
    show({
      title: 'Создание группы',
      content: () => <DialogContent />,
      positiveText: 'Создать',
      negativeText: 'Отмена',
      size: 'm',
      onConfirm: async () => {},
    })
  }

  return { showDialog }
}
