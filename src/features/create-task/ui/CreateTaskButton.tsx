import { Button } from '@/shared/ui'
import { memo } from 'react'

const CreateRoleButton = () => {
  const handleClick = () => {}
  return <Button onClick={handleClick}>Создать задание</Button>
}

export default memo(CreateRoleButton)
