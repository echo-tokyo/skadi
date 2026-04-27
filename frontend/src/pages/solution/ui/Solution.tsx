import { FC, useMemo } from 'react'
import styles from './styles.module.scss'
import {
  SolutionCard,
  TaskCardMode,
  toTaskValues,
} from '@/widgets/solution-card'
import { useParams, Navigate } from 'react-router'
import { useGetSolution } from '../model/use-get-solution'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { Skeleton } from '@/shared/ui'
import { getSchemaByRole, toFormValuesByRole } from '@/entities/solution'
import { TFile } from '@/shared/model'
import { Comments } from '@/widgets/comments'

const Solution: FC = () => {
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

  const mode: TaskCardMode =
    role === 'teacher'
      ? 'teacher'
      : solution?.status.id === 4
        ? 'student-view'
        : 'student-edit'

  const modeForComments = solution?.status.id === 4 ? 'view' : 'edit'

  const displayValues = useMemo(() => toTaskValues(solution), [solution])
  const editableValues = useMemo(
    () => toFormValuesByRole(solution, role),
    [solution, role],
  )

  if (isLoading) {
    return <Skeleton height={'100%'} />
  }

  return (
    <div className={styles.wrapper}>
      <SolutionCard
        solutionId={Number(id)}
        schema={schema}
        serverFiles={serverFiles}
        editableValues={editableValues}
        displayValues={displayValues}
        mode={mode}
        sideBar={
          <Comments
            solutionId={Number(id)}
            role={role}
            mode={modeForComments}
          />
        }
      />
    </div>
  )
}

export default Solution
