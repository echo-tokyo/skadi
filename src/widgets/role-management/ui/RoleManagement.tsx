import { Input, PlugDefault, Select, Sentinel, Text } from '@/shared/ui'
import { useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { CreateRoleButton } from '@/features/create-member'
import { useInfiniteMembers } from '../model/use-infinite-members'
import { MemberCardItem } from './MemberCardItem'
import { ROLES, ROLE_OPTIONS } from '@/shared/config'
import { IMembersQuery } from '@/entities/member'
import { useInfiniteScroll } from '@/shared/lib'

const MEMBERS_PARAMS: IMembersQuery = {
  free: false,
  roles: ROLES,
  perPage: 10,
}

const { actions, roles } = styles

const RoleManagement = () => {
  const [userSearchValue, setUserSearchValue] = useState<string>('')
  const [role, setRole] = useState<string>('')

  const { members, isFetchingNextPage, loadMore, hasMore } =
    useInfiniteMembers(MEMBERS_PARAMS)

  // FIXME: должна быть серверная фильтрация. Проблема: если в поиск что-то ввести, а потом скроллить, то обсервер не срабатывает
  const filteredMembers = useMemo(() => {
    const searchValue = userSearchValue.toLowerCase()
    return members.filter((el) => {
      const matchesFullname =
        el.profile?.fullname?.toLowerCase().includes(searchValue) ?? false
      const matchesUsername = el.username.toLowerCase().includes(searchValue)
      const matchesRole = role ? el.role === role : true
      return matchesRole && (matchesFullname || matchesUsername)
    })
  }, [members, userSearchValue, role])

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isFetchingNextPage,
    loadMore,
  })

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
        <CreateRoleButton />
      </div>

      <div className={roles}>
        {filteredMembers.length > 0 &&
          filteredMembers.map((member) => (
            <MemberCardItem key={member.id} member={member} />
          ))}

        {filteredMembers.length === 0 && <PlugDefault />}

        <Sentinel ref={sentinelRef} />
      </div>
    </>
  )
}

export default RoleManagement
