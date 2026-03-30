import { FormProvider, useForm } from 'react-hook-form'
import { TTaskFullSchema } from '../model/schemas'
import { initialFormValues } from '../config/form-config'
import styles from './styles.module.scss'
import TaskDescription from './components/TaskDescription'
import TaskGeneral from './components/TaskGeneral'
import TaskMaterials from './components/TaskMaterials'
import TaskAnswer from './components/TaskAnswer'
import { TPaginatedSelectField } from '@/shared/model'

interface ITaskCardProps {
  studentOptions: TPaginatedSelectField
  fieldData?: TTaskFullSchema
  mode: 'create' | 'edit'
}

const TaskCard = (props: ITaskCardProps) => {
  const { studentOptions, fieldData } = props
  const methods = useForm<TTaskFullSchema>({
    defaultValues: fieldData || initialFormValues,
  })

  return (
    <div className={styles.cards}>
      {/* TODO: в зависимости от mode будет конкретная фича: сохранить/одобрить/создать */}
      <FormProvider {...methods}>
        <TaskGeneral studentOptions={studentOptions} />
        <TaskDescription />
        <TaskMaterials />
        <TaskAnswer />
      </FormProvider>
    </div>
  )
}

export default TaskCard
