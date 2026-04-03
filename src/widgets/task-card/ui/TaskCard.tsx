import { FormProvider, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import styles from './styles.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import TaskGeneral from './components/TaskGeneral'
import TaskDescription from './components/TaskDescription'
import TaskMaterials from './components/TaskMaterials'
import TaskAnswer from './components/TaskAnswer'
import { UpdateSolutionByTeacherButton } from '@/features/update-solution'
import { STATUS_OPTIONS } from '@/shared/config/selects-options'
import {
  TSolutionTeacherSchema,
  TSolutionStudentSchema,
  solutionTeacherSchema,
  solutionStudentSchema,
} from '@/entities/solution'
import { TDisplayValues } from '../model/types'

// 2 валидации, 1 режим: для препода (редактирует статус и оценку) и ученика (редактирует статус кроме "проверено", ответ и ответ файлом)
interface ITaskCardProps {
  editableValues: TSolutionTeacherSchema | TSolutionStudentSchema
  displayValues: TDisplayValues
  schema: typeof solutionTeacherSchema | typeof solutionStudentSchema
  solutionId: number
}

const TaskCard = (props: ITaskCardProps) => {
  const { editableValues, schema, displayValues, solutionId } = props

  const actualSchema =
    schema === solutionTeacherSchema ? 'teacherSchema' : 'studentSchema'

  const validStatuses = schema.shape.status.options
  const statusOptions = STATUS_OPTIONS.filter(({ value }) =>
    (validStatuses as string[]).includes(value),
  )

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues: editableValues,
    resolver: zodResolver(schema),
  })

  const { reset } = methods

  useEffect(() => {
    reset(editableValues)
  }, [editableValues, reset])

  return (
    <FormProvider {...methods}>
      <div className={styles.actions}>
        <UpdateSolutionByTeacherButton id={solutionId} />
      </div>
      <div className={styles.cards}>
        <TaskGeneral
          displayValues={displayValues}
          statusOptions={statusOptions}
        />
        <TaskDescription displayValues={displayValues} />
        <TaskMaterials />
        <TaskAnswer displayValues={displayValues} actualSchema={actualSchema} />
      </div>
    </FormProvider>
  )
}

export default TaskCard
