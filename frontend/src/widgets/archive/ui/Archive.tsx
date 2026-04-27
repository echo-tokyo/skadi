import { ManagementLayout } from '@/shared/ui'
import { useState } from 'react'
import { useArchiveSolutions } from '../model/use-archive-solutions'
import { ArchiveSolutionCard } from './ArchiveSolutionCard'

const Archive = () => {
  const [search, setSearch] = useState('')
  const { solutions, hasMore, isFetchingNextPage, loadMore, isLoading } =
    useArchiveSolutions({ 'per-page': 10, search })

  return (
    <ManagementLayout
      title='Архив решений'
      searchTitle='Поиск по названию'
      items={solutions}
      isLoading={isLoading}
      onDebouncedSearch={setSearch}
      infiniteScrollOptions={{ hasMore, isFetchingNextPage, loadMore }}
      getKey={(item) => item.id}
      renderItem={(item) => <ArchiveSolutionCard solutionData={item} />}
    />
  )
}

export default Archive
