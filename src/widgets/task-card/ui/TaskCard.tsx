import { FormProvider, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import styles from './styles.module.scss'
import { TPaginatedSelectField } from '@/shared/model'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  solutionStudentSchema,
  solutionTeacherSchema,
  TSolutionStudentSchema,
  TSolutionTeacherSchema,
} from '../model/schemas'
import { TDisplayValues } from '../model/types'
import TaskGeneral from './components/TaskGeneral'
import TaskDescription from './components/TaskDescription'
import TaskMaterials from './components/TaskMaterials'
import TaskAnswer from './components/TaskAnswer'
import { UpdateSolutionButton } from '@/features/update-solution'

// 2 валидации, 1 режим: для препода (редактирует статус и оценку) и ученика (редактирует статус кроме "проверено", ответ и ответ файлом)
interface ITaskCardProps {
  studentOptions: TPaginatedSelectField
  solutionValues: TSolutionTeacherSchema | TSolutionStudentSchema
  taskValues: TDisplayValues
  schema: typeof solutionTeacherSchema | typeof solutionStudentSchema
  solutionId: number
}

const TaskCard = (props: ITaskCardProps) => {
  const { solutionValues, schema, taskValues, studentOptions, solutionId } =
    props

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues: solutionValues,
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    methods.reset(solutionValues)
  }, [solutionValues])

  return (
    <FormProvider {...methods}>
      <div className={styles.actions}>
        <UpdateSolutionButton id={solutionId} />
      </div>
      <div className={styles.cards}>
        <TaskGeneral studentOptions={studentOptions} taskValues={taskValues} />
        <TaskDescription taskValues={taskValues} />
        <TaskMaterials />
        <TaskAnswer />
      </div>
    </FormProvider>
  )
}

export default TaskCard
