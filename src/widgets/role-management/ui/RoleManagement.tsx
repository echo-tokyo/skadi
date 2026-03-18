import { Button, Input, PlugDefault, Select, Text } from '@/shared/ui'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { useCreateMemberDialog } from '@/features/create-member'
import { ROLE_OPTIONS, ROLES } from '@/entities/member'
import { useInfiniteMembers } from '../model/use-infinite-members'
import { MemberCardItem } from './MemberCardItem'

const RoleManagement = (): ReactNode => {
  const [userSearchValue, setUserSearchValue] = useState<string>('')
  const { actions, roles } = styles
  const [role, setRole] = useState<string>('')
  const { showDialog } = useCreateMemberDialog()

  const { members, isFetchingNextPage, loadMore, hasMore } = useInfiniteMembers(
    {
      free: false,
      roles: ROLES,
    },
  )

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

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          loadMore()
        }
      },
      { threshold: 1 },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isFetchingNextPage, loadMore])

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

      <div className={roles}>
        {filteredMembers.length > 0 &&
          filteredMembers.map((member) => (
            <MemberCardItem key={member.id} member={member} />
          ))}

        {filteredMembers.length === 0 && <PlugDefault />}
      </div>

      <div ref={sentinelRef} />
    </>
  )
}

export default RoleManagement
