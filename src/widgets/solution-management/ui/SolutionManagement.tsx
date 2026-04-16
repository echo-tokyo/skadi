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
import { useInfiniteSolutions } from '../model/use-infinite-solutions'
import { useDebounce, useInfiniteScroll, useShowSkeleton } from '@/shared/lib'
import { SolutionCardItem } from './SolutionCardItem'
import { ARCHIVED_OPTIONS } from '@/shared/config'

const { actions, solutions } = styles
const SKELETON_CARDS = Array.from({ length: 10 })

const SolutionManagement = () => {
  const [searchValue, setSearchValue] = useState('')
  const [statusArchived, setStatusArchived] = useState<'archived' | ''>('')
  const debouncedSearch = useDebounce(searchValue)

  const {
    solutions: solutionList,
    hasMore,
    isFetchingNextPage,
    loadMore,
    isLoading,
  } = useInfiniteSolutions({
    'per-page': 10,
    search: debouncedSearch,
    archived: statusArchived === 'archived',
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
        Решения учеников
      </Text>
      <div className={actions}>
        <Input
          fluid
          title='Поиск по названию'
          onChange={setSearchValue}
          value={searchValue}
        />
        <Select
          options={ARCHIVED_OPTIONS}
          value={statusArchived}
          onChange={(val) => setStatusArchived(val)}
        />
      </div>

      <div className={solutions}>
        {solutionList.length === 0 && !isLoading ? (
          <PlugDefault />
        ) : isLoading && showSkeleton ? (
          SKELETON_CARDS.map((_, i) => <Skeleton key={i} height={'64px'} />)
        ) : (
          solutionList.map((solution) => (
            <SolutionCardItem solutionData={solution} key={solution.id} />
          ))
        )}

        <Sentinel ref={sentinelRef} />
      </div>
    </>
  )
}

export default SolutionManagement
