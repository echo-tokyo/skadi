import { Input, PlugDefault, Sentinel, Skeleton, Text } from '@/shared/ui'
import { useState } from 'react'
import { CreateClassButton } from '@/features/create-class'
import { useInfiniteClasses } from '../model/use-infinite-classes'
import { useDebounce, useInfiniteScroll, useShowSkeleton } from '@/shared/lib'
import { ClassCardItem } from './ClassCardItem'
import styles from './styles.module.scss'

const { actions, classes } = styles
const SKELETON_CARDS = Array.from({ length: 10 })

const ClassManagement = () => {
  const [classSearchValue, setClassSearchValue] = useState<string>('')
  const debouncedSearch = useDebounce(classSearchValue)
  const {
    classes: classItems,
    hasMore,
    isFetchingNextPage,
    loadMore,
    isLoading,
  } = useInfiniteClasses({
    search: debouncedSearch,
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
      <Text weight='bold' size='20'>
        Управление группами
      </Text>
      <div className={actions}>
        <Input
          fluid
          title='Найти группу'
          onChange={setClassSearchValue}
          value={classSearchValue}
        />
        <CreateClassButton />
      </div>

      <div className={classes}>
        {classItems.length === 0 && !isLoading ? (
          <PlugDefault />
        ) : isLoading && showSkeleton ? (
          SKELETON_CARDS.map((_, i) => <Skeleton key={i} height={'64px'} />)
        ) : (
          classItems.map((classElem) => (
            <ClassCardItem classData={classElem} key={classElem.id} />
          ))
        )}

        <Sentinel ref={sentinelRef} />
      </div>
    </>
  )
}

export default ClassManagement
