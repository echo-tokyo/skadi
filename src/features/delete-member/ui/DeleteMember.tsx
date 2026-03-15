import { Button } from '@/shared/ui'
import { useDeleteMemberDialog } from '../model/use-delete-member-dialog'

interface IDeleteMemberProps {
  id: number
  fullname?: string
}

export const DeleteMember = (props: IDeleteMemberProps) => {
  const { show } = useDeleteMemberDialog()
  const { fullname = 'пользователь', id } = props

  const handleClick = () => {
    show({ fullname, id })
  }

  return (
    <Button color='inverted' onClick={handleClick}>
      Удалить пользователя
    </Button>
  )
}

DeleteMember.displayName = 'DeleteMember'
