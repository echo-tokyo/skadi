import { FormProvider, useForm } from 'react-hook-form'
import { z, ZodAny } from 'zod'
import { initialFormValues } from '../config/form-config'
import styles from './styles.module.scss'
import TaskDescription from './components/TaskDescription'
import TaskGeneral from './components/TaskGeneral'
import TaskMaterials from './components/TaskMaterials'
import TaskAnswer from './components/TaskAnswer'
import { TPaginatedSelectField } from '@/shared/model'
import { TDisplayValues, TMode } from '../model/types'
import { CreateTaskButton } from '@/features/create-task'
import { UpdateTaskButton } from '@/features/update-task'
import { zodResolver } from '@hookform/resolvers/zod'
import { TSolutionTeacherSchema, TTaskSchema } from '../model/schemas'
interface ITaskCardProps {
  studentOptions: TPaginatedSelectField
  defaultValues?: TTaskSchema | TSolutionTeacherSchema
  displayValues?: TDisplayValues
  mode: TMode
  taskId?: number
  schema: ZodAny
}

const TaskCard = (props: ITaskCardProps) => {
  const { studentOptions, defaultValues, mode, taskId, schema } = props

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues: defaultValues || initialFormValues,
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
