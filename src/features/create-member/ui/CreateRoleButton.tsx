import { Button } from '@/shared/ui'
import { useCreateMemberDialog } from '../model/useCreateMemberDialog'

const CreateRoleButton = () => {
  const { showDialog } = useCreateMemberDialog()
  return <Button onClick={showDialog}>Создать роль</Button>
}

export default CreateRoleButton
