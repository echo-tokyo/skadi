import { FC, useMemo } from 'react'
import styles from './styles.module.scss'
import { TaskCard, toTaskValues } from '@/widgets/task-card'
import { useParams, Navigate } from 'react-router'
import { useGetSolution } from '../model/use-get-solution'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { Skeleton } from '@/shared/ui'
import { getSchemaByRole, toFormValuesByRole } from '@/entities/solution'
import { TFile } from '@/shared/model'
import { Comments } from '@/widgets/comments'

const Task: FC = () => {
  const { id } = useParams()
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role

  if (role === 'admin') {
    return <Navigate to='/personal-area' replace />
  }

  const { data, isLoading } = useGetSolution(id)
  const schema = getSchemaByRole(role)
  const solution = data?.solution
  const serverFiles: TFile[] = data?.solution.files ?? []

  const displayValues = useMemo(() => toTaskValues(solution), [solution])
  console.log(displayValues)
  const editableValues = useMemo(
    () => toFormValuesByRole(solution, role),
    [solution, role],
  )
  console.log(editableValues)

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Skeleton height={'100%'} />
      ) : (
        <TaskCard
          solutionId={Number(id)}
          schema={schema}
          serverFiles={serverFiles}
          editableValues={editableValues}
          displayValues={displayValues}
          sideBar={<Comments solutionId={Number(id)} role={role} />}
        />
      )}
    </div>
  )
}

export default Task
