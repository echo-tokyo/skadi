import { FC } from 'react'
import styles from './styles.module.scss'
import { TaskCard } from '@/widgets/task-card'
import { useMemberSelectOptions } from '@/entities/member'
import { useParams } from 'react-router'

const Task: FC = () => {
  const {
    options,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
  } = useMemberSelectOptions('student')

  const { id } = useParams()
  // TODO: препод может быть в двух режимах, а ученик только в edit
  const mode = id ? 'edit' : 'create'

  return (
    <div className={styles.wrapper}>
      <TaskCard
        mode={mode}
        studentOptions={{
          data: options,
          hasMore: hasNextPage,
          isLoadingMore: isFetchingNextPage,
          onLoadMore: fetchNextPage,
          onSearchChange,
        }}
        fieldData={{
          description: 'fefe',
          status: '3',
          students: ['68'],
          teacher: 'fef',
          title: 'kek',
        }}
      />
    </div>
  )
}

export default Task
