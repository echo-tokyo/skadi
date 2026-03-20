import { Input, Text } from '@/shared/ui'
import { memo, useState } from 'react'
import styles from './styles.module.scss'
import { CreateClassButton } from '@/features/create-class'

const { actions } = styles

const ClassManagement = () => {
  const [classSearchValue, setClassSearchValue] = useState<string>('')
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
        <CreateClassButton />
      </div>
    </>
  )
}

export default memo(ClassManagement)
