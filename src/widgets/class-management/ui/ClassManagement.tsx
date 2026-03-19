import { Button, Input, Text } from '@/shared/ui'
import { useState } from 'react'
import styles from './styles.module.scss'
import { useCreateClassDialog } from '@/features/create-class/model/useCreateClassDialog'

const { actions } = styles

const ClassManagement = () => {
  const [classSearchValue, setClassSearchValue] = useState<string>('')
  const { showDialog } = useCreateClassDialog()

  return (
    <>
      <Text weight='bold' size='20'>
        Управление группами
      </Text>
      <div className={actions}>
        <Input
          fluid
          title='Найти группу'
          onChange={setClassSearchValue}
          value={classSearchValue}
        />
        <Button onClick={showDialog}>Создать группу</Button>
      </div>
    </>
  )
}

export default ClassManagement
