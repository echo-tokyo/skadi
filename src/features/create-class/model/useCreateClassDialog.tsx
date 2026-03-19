import { ClassForm } from '@/entities/class'
import { useDialog } from '@/shared/lib'

export const useCreateClassDialog = () => {
  const { show } = useDialog()

  const showDialog = (): void => {
    show({
      title: 'Создание группы',
      content: <ClassForm />,
      positiveText: 'Создать',
      negativeText: 'Отмена',
      size: 'm',
      onConfirm: async () => {},
    })
  }

  return { showDialog }
}
