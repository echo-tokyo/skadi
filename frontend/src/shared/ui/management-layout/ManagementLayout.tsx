import { Input, PlugDefault, Sentinel, Skeleton, Text } from '@/shared/ui'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { useDebounce, useInfiniteScroll, useShowSkeleton } from '@/shared/lib'
import { IInfiniteScrollProps } from '@/shared/lib/hooks/use-infinite-scroll'

const { managementActions, managementList } = styles
const SKELETON_CARDS = Array.from({ length: 10 })

interface ManagementLayoutProps<T> {
  title: string
  items: T[]
  isLoading: boolean
  infiniteScrollOptions: IInfiniteScrollProps
  actions?: ReactNode
  searchTitle: string
  renderItem: (item: T) => ReactNode
  onDebouncedSearch: (value: string) => void
  getKey?: (item: T, index: number) => React.Key
}

const ManagementLayout = <T,>(props: ManagementLayoutProps<T>) => {
  const {
    title,
    items,
    isLoading,
    infiniteScrollOptions,
    actions,
    searchTitle,
    renderItem,
    onDebouncedSearch,
    getKey,
  } = props

  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearch = useDebounce(searchValue)

  useEffect(() => {
    onDebouncedSearch(debouncedSearch)
  }, [debouncedSearch])

  const showSkeleton = useShowSkeleton(isLoading)

  const { sentinelRef } = useInfiniteScroll(infiniteScrollOptions)

  return (
    <>
      <Text weight='600' size='20'>
        {title}
      </Text>
      <div className={managementActions}>
        <Input
          fluid
          title={searchTitle}
          onChange={setSearchValue}
          value={searchValue}
        />
        {actions}
      </div>

      <div className={managementList}>
        {items.length === 0 && !isLoading ? (
          <PlugDefault />
        ) : isLoading && showSkeleton ? (
          SKELETON_CARDS.map((_, i) => <Skeleton key={i} height={'64px'} />)
        ) : (
          items.map((item, i) => (
            <Fragment key={getKey ? getKey(item, i) : i}>
              {renderItem(item)}
            </Fragment>
          ))
        )}

        <Sentinel ref={sentinelRef} />
      </div>
    </>
  )
}

export default ManagementLayout
