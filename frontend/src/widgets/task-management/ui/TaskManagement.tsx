import { Input, PlugDefault, Sentinel, Skeleton, Text } from '@/shared/ui'
import { useState } from 'react'
import styles from './styles.module.scss'
import { useInfiniteTasks } from '../model/use-infinite-tasks'
import { useDebounce, useInfiniteScroll, useShowSkeleton } from '@/shared/lib'
import { TaskCardItem } from './TaskCardItem'
import { CreateTaskButton } from '@/features/create-task'

const { actions, tasks } = styles
const SKELETON_CARDS = Array.from({ length: 10 })

const TaskManagement = () => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue)

  const {
    tasks: taskList,
    hasMore,
    isFetchingNextPage,
    loadMore,
    isLoading,
  } = useInfiniteTasks({ 'per-page': 10, search: debouncedSearch })

  const showSkeleton = useShowSkeleton(isLoading)

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isFetchingNextPage,
    loadMore,
  })

  return (
    <>
      <Text weight='600' size='20'>
        Домашние задания
      </Text>
      <div className={actions}>
        <Input
          fluid
          title='Поиск по названию'
          onChange={setSearchValue}
          value={searchValue}
        />
        <CreateTaskButton />
      </div>

      <div className={tasks}>
        {taskList.length === 0 && !isLoading ? (
          <PlugDefault />
        ) : isLoading && showSkeleton ? (
          SKELETON_CARDS.map((_, i) => <Skeleton key={i} height={'64px'} />)
        ) : (
          taskList.map((task) => (
            <TaskCardItem taskData={task} key={task.task.id} />
          ))
        )}

        <Sentinel ref={sentinelRef} />
      </div>
    </>
  )
}

export default TaskManagement
