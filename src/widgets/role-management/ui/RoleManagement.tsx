import { Button, Input, Select, Text } from '@/shared/ui'
import { ReactNode, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { useCreateMemberDialog } from '@/features/create-member'
import {
  IMembersRequest,
  MemberCard,
  ROLE_OPTIONS,
  ROLES,
} from '@/entities/member'
import { useGetMembers } from '../model/get-members'
import { DeleteMember } from '@/features/delete-member'
import { EditMember } from '@/features/edit-member'

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
          {members.map((member) => (
            <MemberCard
              key={member.id}
              fullname={member.profile?.fullname}
              group={member.profile?.class?.name}
              memberRole={member.role}
              actions={
                <div className={styles.cardActions}>
                  <DeleteMember
                    fullname={member.profile?.fullname}
                    id={member.id}
                  />
                  <EditMember member={member} />
                </div>
              }
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default RoleManagement
