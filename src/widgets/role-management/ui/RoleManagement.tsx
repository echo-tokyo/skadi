import { Button, Input, Select, Text } from '@/shared/ui'
import { ReactNode, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { useCreateMemberDialog } from '@/features/create-member'
import { IMembersRequest, ROLE_OPTIONS, ROLES } from '@/entities/member'
import { useGetMembers } from '../model/get-members'
import { MemberCardItem } from './MemberCardItem'

const RoleManagement = (): ReactNode => {
  const [userSearchValue, setUserSearchValue] = useState<string>('')
  const { actions, roles } = styles
  const [role, setRole] = useState<string>('')
  const { showDialog } = useCreateMemberDialog()

  const params: IMembersRequest = useMemo(
    () => ({
      free: true,
      page: 1,
      perPage: 20,
      roles: ROLES,
    }),
    [],
  )
  const { members } = useGetMembers(params)

  const filteredMembers = useMemo(() => {
    const searchValue = userSearchValue.toLowerCase()
    return members.filter((el) => {
      const matchesFullname = el.profile?.fullname?.toLowerCase().includes(searchValue) ?? false
      const matchesUsername = el.username.toLowerCase().includes(searchValue)
      return matchesFullname || matchesUsername
    })
  }, [members, userSearchValue])

  return (
    <>
      <Text weight='bold' size='20'>
        Управление ролями
      </Text>
      <div className={actions}>
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
        <Button onClick={showDialog}>Создать роль</Button>
      </div>

      <div className={styles.rolesWrapper}>
        <div className={roles}>
          {filteredMembers.map((member) => (
            <MemberCardItem key={member.id} member={member} />
          ))}
        </div>
      </div>
    </>
  )
}

export default RoleManagement
