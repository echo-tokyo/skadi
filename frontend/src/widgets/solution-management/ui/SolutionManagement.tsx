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
import { STATUS_OPTIONS } from '@/shared/config'
import { TStatusId, TStatusValue } from '@/shared/model'

const { actions, solutions } = styles
const SKELETON_CARDS = Array.from({ length: 10 })

const SolutionManagement = () => {
  const [searchValue, setSearchValue] = useState('')
  const [status, setStatus] = useState<TStatusId>(3)
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
    status_id: status,
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
          label='Фильтровать по:'
          options={STATUS_OPTIONS}
          value={status.toString() as TStatusValue}
          onChange={(val) => setStatus(Number(val) as TStatusId)}
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
