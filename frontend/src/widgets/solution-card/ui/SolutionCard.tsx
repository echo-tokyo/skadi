import { FormProvider, useForm } from 'react-hook-form'
import { ReactNode, useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from './styles.module.scss'
import {
  TSolutionTeacherSchema,
  TSolutionStudentSchema,
  solutionTeacherSchema,
  solutionStudentSchema,
} from '@/entities/solution'
import { TaskCardMode, TDisplayValues } from '../model/types'
import { STATUS_OPTIONS } from '@/shared/config'
import { Button } from '@/shared/ui'
import { TFile } from '@/shared/model'
import { UpdateSolutionButton } from '@/features/update-solution'
import TaskGeneral from './components/TaskGeneral'
import TaskDescription from './components/TaskDescription'
import TaskMaterials from './components/TaskMaterials'
import TaskViewAnswer from './components/TaskViewAnswer'
import TaskEditAnswer from './components/TaskEditAnswer'

interface ITaskCardProps {
  mode: TaskCardMode
  editableValues: TSolutionTeacherSchema | TSolutionStudentSchema
  displayValues: TDisplayValues
  schema: typeof solutionTeacherSchema | typeof solutionStudentSchema
  solutionId: number
  serverFiles: TFile[]
  sideBar: ReactNode
}

const SolutionCard = (props: ITaskCardProps) => {
  const {
    mode,
    editableValues,
    schema,
    displayValues,
    solutionId,
    serverFiles,
    sideBar,
  } = props

  const isViewOnly = mode === 'student-view'
  const actualSchema = mode === 'teacher' ? 'teacherSchema' : 'studentSchema'

  const validStatuses = schema.shape.status.values
  const statusOptions = STATUS_OPTIONS.filter(
    ({ value }) => validStatuses && Array.from(validStatuses).includes(value),
  ).map((opt) =>
    mode === 'student-edit' && opt.value === 4
      ? { ...opt, disabled: true }
      : opt,
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
      {!isViewOnly && (
        <div className={styles.actions}>
          <Button onClick={reset} disabled={!isDirty} color='secondary'>
            Сбросить
          </Button>
          <UpdateSolutionButton id={solutionId} actualSchema={actualSchema} />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.cards}>
          <TaskGeneral
            displayValues={displayValues}
            statusOptions={statusOptions}
            disabled={isViewOnly}
          />
          <TaskDescription displayValues={displayValues} />
          <TaskMaterials displayValues={displayValues} />
          {mode === 'teacher' || mode === 'student-view' ? (
            <TaskViewAnswer displayValues={displayValues} />
          ) : (
            <TaskEditAnswer serverFiles={serverFiles} disabled={isViewOnly} />
          )}
        </div>
        {sideBar}
      </div>
    </FormProvider>
  )
}

export default SolutionCard
