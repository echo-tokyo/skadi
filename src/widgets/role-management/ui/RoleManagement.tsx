import { Button, Input, Select, Text } from '@/shared/ui'
import { ReactNode, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { useCreateMemberDialog } from '@/features/create-member'
import { IMembersRequest, MemberCard, ROLE_OPTIONS } from '@/entities/member'
import { useGetMembers } from '../model/get-members'
import { DeleteMember } from '@/features/delete-member'

const RoleManagement = (): ReactNode => {
  const [userSearchValue, setUserSearchValue] = useState<string>('')
  const { actions, roles } = styles
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

  const renderMemberCard = useMemo(
    () =>
      members.map((el) => (
        <MemberCard
          key={el.id}
          fullname={el.profile?.fullname}
          group={el.profile?.class?.name}
          memberRole={el.role}
          actions={<DeleteMember fullname={el.profile?.fullname} id={el.id} />}
        />
      )),
    [members],
  )

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
        <Button onClick={show}>Создать роль</Button>
      </div>

      <div className={roles}>{renderMemberCard}</div>
    </>
  )
}

export default RoleManagement
