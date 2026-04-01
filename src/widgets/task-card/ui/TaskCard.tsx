import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { initialFormValues } from '../config/form-config'
import styles from './styles.module.scss'
import TaskDescription from './components/TaskDescription'
import TaskGeneral from './components/TaskGeneral'
import TaskMaterials from './components/TaskMaterials'
import TaskAnswer from './components/TaskAnswer'
import { TPaginatedSelectField } from '@/shared/model'
import { TMode } from '../model/types'
import { CreateTaskButton } from '@/features/create-task'
import { UpdateTaskButton } from '@/features/update-task'
import { zodResolver } from '@hookform/resolvers/zod'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { useGetSchema } from '../model/useSchema'
import { TTaskSchema } from '../model/schemas'

interface ITaskCardProps {
  studentOptions: TPaginatedSelectField
  fieldData?: TTaskSchema
  mode: TMode
  taskId?: number
}

const TaskCard = (props: ITaskCardProps) => {
  const { studentOptions, fieldData, mode, taskId } = props

  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role
  const schema = useGetSchema(mode, role)

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues: fieldData || initialFormValues,
    resolver: zodResolver(schema),
  })

  return (
    <FormProvider {...methods}>
      <div className={styles.actions}>
        {mode === 'create' && <CreateTaskButton />}
        {mode === 'edit' && taskId && <UpdateTaskButton id={taskId} />}
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
