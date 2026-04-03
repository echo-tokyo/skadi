import { FC } from 'react'
import styles from './styles.module.scss'
import { TaskCard } from '@/widgets/task-card'
import { useMemberSelectOptions } from '@/entities/member'
import { useParams } from 'react-router'
import { useGetSolution } from '../model/use-get-solution'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { useGetSchema } from '../model/useSchema'
import { toSolutionValues } from '../lib/to-solution-values'
import { toTaskValues } from '../lib/to-task-values'

const Task: FC = () => {
  const { id } = useParams()
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role

  const {
    options,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
  } = useMemberSelectOptions('student')

  const { data } = useGetSolution(id)
  const solution = data?.solution

  const schema = useGetSchema(role)
  const solutionValues = toSolutionValues(solution)
  const taskValues = toTaskValues(solution)

  return (
    <div className={styles.wrapper}>
      <TaskCard
        solutionId={Number(id)}
        schema={schema}
        solutionValues={solutionValues}
        taskValues={taskValues}
        studentOptions={{
          data: options,
          hasMore: hasNextPage,
          isLoadingMore: isFetchingNextPage,
          onLoadMore: fetchNextPage,
          onSearchChange,
        }}
      />
    </div>
  )
}

export default Task
