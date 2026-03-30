import { FormProvider, useForm } from 'react-hook-form'
import { taskCreateSchema, TTaskCreateSchema } from '../model/schemas'
import { initialFormValues } from '../config/form-config'
import styles from './styles.module.scss'
import TaskDescription from './components/TaskDescription'
import TaskGeneral from './components/TaskGeneral'
import TaskMaterials from './components/TaskMaterials'
import TaskAnswer from './components/TaskAnswer'
import { TPaginatedSelectField } from '@/shared/model'
import { TMode } from '../model/types'
import { CreateTaskButton } from '@/features/create-task'
import { zodResolver } from '@hookform/resolvers/zod'

interface ITaskCardProps {
  studentOptions: TPaginatedSelectField
  fieldData?: TTaskCreateSchema
  mode: TMode
}

const TaskCard = (props: ITaskCardProps) => {
  const { studentOptions, fieldData, mode } = props

  // const user = useAppSelector(selectAuthenticatedUser)
  // const role = user.role
  // const schema = useGetSchema(mode, role)

  const methods = useForm<TTaskCreateSchema>({
    defaultValues: fieldData || initialFormValues,
    resolver: zodResolver(taskCreateSchema),
  })

  return (
    <FormProvider {...methods}>
      <div className={styles.actions}>
        {mode === 'create' && <CreateTaskButton />}
      </div>
      <div className={styles.cards}>
        <TaskGeneral studentOptions={studentOptions} />
        <TaskDescription />
        <TaskMaterials />
        <TaskAnswer />
      </div>
    </FormProvider>
  )
}

export default TaskCard
