import { FormProvider, useForm } from 'react-hook-form'
import { ReactNode, useEffect } from 'react'
import { z } from 'zod'
import styles from './styles.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import TaskGeneral from './components/TaskGeneral'
import TaskDescription from './components/TaskDescription'
import TaskMaterials from './components/TaskMaterials'
import TaskAnswer from './components/TaskAnswer'
import { UpdateSolutionButton } from '@/features/update-solution'
import {
  TSolutionTeacherSchema,
  TSolutionStudentSchema,
  solutionTeacherSchema,
  solutionStudentSchema,
} from '@/entities/solution'
import { TDisplayValues } from '../model/types'
import { STATUS_OPTIONS } from '@/shared/config'
import { Button } from '@/shared/ui'
import { TFile } from '@/shared/model'

// 2 валидации, 1 режим: для препода (редактирует статус и оценку) и ученика (редактирует статус кроме "проверено", ответ и ответ файлом)

interface ITaskCardProps {
  editableValues: TSolutionTeacherSchema | TSolutionStudentSchema
  displayValues: TDisplayValues
  schema: typeof solutionTeacherSchema | typeof solutionStudentSchema
  solutionId: number
  serverFiles: TFile[]
  sideBar: ReactNode
}

const TaskCard = (props: ITaskCardProps) => {
  const {
    editableValues,
    schema,
    displayValues,
    solutionId,
    serverFiles,
    sideBar,
  } = props

  const actualSchema =
    schema === solutionTeacherSchema ? 'teacherSchema' : 'studentSchema'

  const validStatuses = schema.shape.status.values
  const statusOptions = STATUS_OPTIONS.filter(
    ({ value }) => validStatuses && Array.from(validStatuses).includes(value),
  )

  const methods = useForm<z.infer<typeof schema>>({
    defaultValues: editableValues,
    resolver: zodResolver(schema),
  })

  const {
    reset,
    formState: { isDirty },
  } = methods

  useEffect(() => {
    reset(editableValues)
  }, [editableValues, reset])

  return (
    <FormProvider {...methods}>
      <div className={styles.actions}>
        <Button onClick={reset} disabled={!isDirty} color='secondary'>
          Сбросить
        </Button>
        <UpdateSolutionButton id={solutionId} actualSchema={actualSchema} />
      </div>
      <div className={styles.content}>
        <div className={styles.cards}>
          <TaskGeneral
            displayValues={displayValues}
            statusOptions={statusOptions}
          />
          <TaskDescription displayValues={displayValues} />
          <TaskMaterials displayValues={displayValues} />
          <TaskAnswer
            displayValues={displayValues}
            actualSchema={actualSchema}
            serverFiles={serverFiles}
          />
        </div>
        {sideBar}
      </div>
    </FormProvider>
  )
}

export default TaskCard
