import { Button, Input, Text } from '@/shared/ui'
import { useState } from 'react'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router'

const { actions, tasks } = styles

const RoleManagement = () => {
  const [searchValue, setSearchValue] = useState('')
  const nav = useNavigate()
  // const debouncedSearch = useDebounce(searchValue)

  // const { members, isFetchingNextPage, loadMore, hasMore } = useInfiniteMembers(
  //   {
  //     free: false,
  //     role: role ? [role] : ROLE_VALUES,
  //     search: debouncedSearch || undefined,
  //     'per-page': 10,
  //   },
  // )

  // const { sentinelRef } = useInfiniteScroll({
  //   hasMore,
  //   isFetchingNextPage,
  //   loadMore,
  // })

  return (
    <>
      <Text weight='bold' size='20'>
        Домашние задания
      </Text>
      <div className={actions}>
        <Input
          fluid
          title='Поиск по названию'
          onChange={setSearchValue}
          value={searchValue}
        />
        <Button onClick={() => nav('/personal-area/tasks/new')}>
          Создать задание
        </Button>
      </div>

      <div className={tasks}>
        {/* {members.length === 0 ? (
          <PlugDefault />
        ) : (
          members.map((member) => (
            <MemberCardItem key={member.id} member={member} />
          ))
        )} */}

        {/* <Sentinel ref={sentinelRef} /> */}
      </div>
    </>
  )
}

export default RoleManagement
