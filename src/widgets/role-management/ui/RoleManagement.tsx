import { Button, Input, Select, Text } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import { ReactNode, useState } from 'react'
import styles from './styles.module.scss'
import { useDialog } from '@/shared/lib'

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'admin', label: 'Администратор' },
  { value: 'teacher', label: 'Преподаватель' },
  { value: 'student', label: 'Студент' },
]

const RoleManagement = (): ReactNode => {
  const [userSearchValue, setUserSearchValue] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const show = useDialog()

  return (
    <>
      <Text weight='bold' size='20'>
        Управление ролями
      </Text>
      <div className={styles.actions}>
        <Input
          fluid
          title='Найти пользователя'
          onChange={setUserSearchValue}
          value={userSearchValue}
        />
        <Select
          label='Фильтровать по:'
          placeholder='Выберите'
          options={ROLE_OPTIONS}
          value={role}
          onChange={setRole}
        />
        <Button
          onClick={() => show({ content: 'fef', title: 'Создание новой роли' })}
        >
          Создать роль
        </Button>
      </div>
    </>
  )
}

export default RoleManagement
