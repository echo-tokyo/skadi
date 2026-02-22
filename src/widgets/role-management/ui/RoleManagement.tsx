import { Input, Select, Text } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import { ReactNode, useState } from 'react'

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'admin', label: 'Администратор' },
  { value: 'teacher', label: 'Преподаватель' },
  { value: 'student', label: 'Студент' },
]

const PERMISSION_OPTIONS: SelectOption[] = [
  { value: 'read', label: 'Просмотр' },
  { value: 'write', label: 'Редактирование' },
  { value: 'delete', label: 'Удаление' },
  { value: 'manage_users', label: 'Управление пользователями' },
]

const RoleManagement = (): ReactNode => {
  const [userSearchValue, setUserSearchValue] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [permissions, setPermissions] = useState<string[]>([])

  return (
    <>
      <Text weight='bold' size='20'>
        Управление ролями
      </Text>
      <Input
        fluid
        title='Найти пользователя'
        onChange={setUserSearchValue}
        value={userSearchValue}
      />
      <Select
        label='Роль'
        placeholder='Выберите роль'
        options={ROLE_OPTIONS}
        value={role}
        onChange={setRole}
      />
      <Select
        multiple
        label='Права доступа'
        placeholder='Выберите права'
        options={PERMISSION_OPTIONS}
        value={permissions}
        onChange={setPermissions}
      />
    </>
  )
}

export default RoleManagement
