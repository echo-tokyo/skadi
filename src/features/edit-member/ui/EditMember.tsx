import { Button } from '@/shared/ui'
import { useEditMemberDialog } from '../model/use-edit-member-dialog'
import { IMember } from '@/entities/member'

interface IEditMemberProps {
  member: IMember
}

export const EditMember = (props: IEditMemberProps) => {
  const { show } = useEditMemberDialog(props.member)

  const handleClick = () => {
    show()
  }

  return (
    <Button color='secondary' onClick={handleClick}>
      Редактировать
    </Button>
  )
}

EditMember.displayName = 'EditMember'
