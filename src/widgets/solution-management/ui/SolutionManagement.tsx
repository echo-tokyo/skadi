import { Input, PlugDefault, Sentinel, Skeleton, Text } from '@/shared/ui'
import { useState } from 'react'
import styles from './styles.module.scss'
import { useInfiniteSolutions } from '../model/use-infinite-solutions'
import { useDebounce, useInfiniteScroll, useShowSkeleton } from '@/shared/lib'
import { SolutionCardItem } from './SolutionCardItem'

const { actions, solutions } = styles
const SKELETON_CARDS = Array.from({ length: 10 })

const SolutionManagement = () => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue)

  const {
    solutions: solutionList,
    hasMore,
    isFetchingNextPage,
    loadMore,
    isLoading,
  } = useInfiniteSolutions({ 'per-page': 10, search: debouncedSearch })

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
