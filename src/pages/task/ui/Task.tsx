import { FC } from 'react'
import styles from './styles.module.scss'
import { TaskCard, TMode } from '@/widgets/task-card'
import { useMemberSelectOptions } from '@/entities/member'
import { useLocation, useParams } from 'react-router'
import { useGetSolution } from '../model/use-get-solution'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { useGetSchema } from '../model/useSchema'
import { ZodAny } from 'zod'

const Task: FC = () => {
  const { id } = useParams()
  const location = useLocation()
  const isSolution = location.pathname.includes('/solutions/')
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role

  const {
    options,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSearchChange,
  } = useMemberSelectOptions('student')

  const { data } = useGetSolution(id, isSolution)
  const _solution = data?.solution

  const page: 'solution' | 'task' = isSolution ? 'solution' : 'task'
  const mode: TMode = id ? 'edit' : 'create'
  const schema = useGetSchema(mode, role, page)

  return (
    <div className={styles.wrapper}>
      <TaskCard
        mode={mode}
        schema={schema as unknown as ZodAny}
        studentOptions={{
          data: options,
          hasMore: hasNextPage,
          isLoadingMore: isFetchingNextPage,
          onLoadMore: fetchNextPage,
          onSearchChange,
        }}
        // defaultValues={defaultValues}
        taskId={id ? Number(id) : undefined}
      />
    </div>
  )
}

export default Task
