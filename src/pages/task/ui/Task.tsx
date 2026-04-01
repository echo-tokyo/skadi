import { FC } from 'react'
import styles from './styles.module.scss'
import { TaskCard, TMode } from '@/widgets/task-card'
import { useMemberSelectOptions } from '@/entities/member'
import { useParams } from 'react-router'
import { toFieldTaskData } from '../model/mock'

const Task: FC = () => {
  const { id } = useParams()

  const {
    options,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
  } = useMemberSelectOptions('student')

  // const { data } = useGetSolution(id)
  // const solution = data?.solution
  // console.log(solution)

  const mode: TMode = id ? 'edit' : 'create'

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
        fieldData={toFieldTaskData}
        taskId={id ? Number(id) : undefined}
      />
    </div>
  )
}

export default Task
