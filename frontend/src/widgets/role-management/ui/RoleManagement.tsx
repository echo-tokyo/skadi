import {
  Input,
  PlugDefault,
  Select,
  Sentinel,
  Skeleton,
  Text,
} from '@/shared/ui'
import { useState } from 'react'
import styles from './styles.module.scss'
import { CreateRoleButton } from '@/features/create-member'
import { useInfiniteMembers } from '../model/use-infinite-members'
import { MemberCardItem } from './MemberCardItem'
import { ROLE_OPTIONS, ROLE_VALUES } from '@/shared/config'
import { TRole } from '@/shared/model'
import { useDebounce, useInfiniteScroll, useShowSkeleton } from '@/shared/lib'

const { actions, roles } = styles
const SKELETON_CARDS = Array.from({ length: 10 })

const RoleManagement = () => {
  const [searchValue, setSearchValue] = useState('')
  const [role, setRole] = useState<TRole | ''>('')

  const debouncedSearch = useDebounce(searchValue)

  const { members, isFetchingNextPage, loadMore, hasMore, isLoading } =
    useInfiniteMembers({
      free: false,
      role: role ? [role] : ROLE_VALUES,
      search: debouncedSearch || undefined,
      'per-page': 10,
    })

  const showSkeleton = useShowSkeleton(isLoading)

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isFetchingNextPage,
    loadMore,
  })

  return (
    <>
      <Text weight='600' size='20'>
        Управление ролями
      </Text>
      <div className={actions}>
        <Input
          fluid
          title='Найти пользователя'
          onChange={setSearchValue}
          value={searchValue}
        />
        <Select
          label='Фильтровать по:'
          placeholder='Выберите'
          options={ROLE_OPTIONS}
          value={role}
          onChange={(val) => setRole(val as TRole)}
        />
        <CreateRoleButton />
      </div>

      <div className={roles}>
        {members.length === 0 && !isLoading ? (
          <PlugDefault />
        ) : isLoading && showSkeleton ? (
          SKELETON_CARDS.map((_, i) => <Skeleton key={i} height={'64px'} />)
        ) : (
          members.map((member) => (
            <MemberCardItem key={member.id} member={member} />
          ))
        )}

        <Sentinel ref={sentinelRef} />
      </div>
    </>
  )
}

export default RoleManagement
