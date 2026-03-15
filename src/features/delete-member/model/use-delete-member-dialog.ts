import { useDialog } from '@/shared/lib'
import { useDeleteMember } from './use-delete-member'

interface IProps {
  id: number
  fullname: string
}

export const useDeleteMemberDialog = () => {
  const showDialog = useDialog()
  const { deleteMemberById } = useDeleteMember()

  const show = (props: IProps): void => {
    showDialog({
      title: 'Подтвердите',
      content: `Удалить пользователя ${props.fullname}?`,
      positiveText: 'Удалить',
      onConfirm: async () => {
        const success = await deleteMemberById(props.id)
        if (!success) {
          throw new Error('Не удалось удалить пользователя')
        }
      },
    })
  }

  return { show }
}
