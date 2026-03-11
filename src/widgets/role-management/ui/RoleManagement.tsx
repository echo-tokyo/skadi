import { Button, Input, Select, Text } from '@/shared/ui'
import { ReactNode, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { useCreateMemberDialog } from '@/features/create-member'
import { ROLE_OPTIONS } from '@/entities/member'
import { useGetMembers } from '../api/get-members'
import { IMembersRequest } from '@/entities/member/model/types'

const RoleManagement = (): ReactNode => {
  const [userSearchValue, setUserSearchValue] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const { show } = useCreateMemberDialog()
  const params: IMembersRequest = useMemo(
    () => ({
      free: true,
      page: 1,
      perPage: 20,
      roles: ['admin', 'student', 'teacher'],
    }),
    [],
  )
  const { members } = useGetMembers(params)
  const membersData = members?.data

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
        <Button onClick={show}>Создать роль</Button>
      </div>

      <div className=''>
        {membersData?.map((el) => (
          <p key={el.id}>{el.username}</p>
        ))}
      </div>
    </>
  )
}

export default RoleManagement
