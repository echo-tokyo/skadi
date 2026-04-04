import { FC } from 'react'
import styles from './styles.module.scss'
import { TaskCard, toTaskValues } from '@/widgets/task-card'
import { useParams } from 'react-router'
import { useGetSolution } from '../model/use-get-solution'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { Skeleton } from '@/shared/ui'
import { getSchemaByRole, toFormValuesByRole } from '@/entities/solution'

const Task: FC = () => {
  const { id } = useParams()
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role

  const { data, isLoading } = useGetSolution(id)
  const solution = data?.solution

  // TODO: добавить toStudentFormValues. в toTaskValues должны быть все поля, которые могут быть неизменяемыми, или нужно разделить на teacher и student (?)
  const schema = getSchemaByRole(role)
  const solutionValues = toFormValuesByRole(solution, role)
  const taskValues = toTaskValues(solution)

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Skeleton height={'100%'} />
      ) : (
        <TaskCard
          solutionId={Number(id)}
          schema={schema}
          editableValues={solutionValues}
          displayValues={taskValues}
        />
      )}
    </div>
  )
}

export default Task
