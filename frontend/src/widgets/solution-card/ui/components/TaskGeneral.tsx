import { Input, Select, SelectOption, Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { Controller, useFormContext } from 'react-hook-form'
import { TaskCardMode, TDisplayValues } from '../../model/types'
import { TStatusId } from '@/shared/model'
import { TSolutionTeacherSchema } from '@/entities/solution'
import { GRADE_OPTIONS } from '@/shared/config'
import { useMemo } from 'react'

interface ITaskGeneralSectionProps {
  displayValues: TDisplayValues
  statusOptions: SelectOption<TStatusId>[]
  disabled?: boolean
  mode: TaskCardMode
}

const noop = () => undefined

const TaskGeneral = ({
  displayValues,
  statusOptions,
  disabled = false,
  mode,
}: ITaskGeneralSectionProps) => {
  const { control, getValues } = useFormContext<TSolutionTeacherSchema>()
  const status = getValues('status')

  const grade = useMemo(() => {
    const gradeOption = GRADE_OPTIONS.filter(
      (el) => el.value === displayValues.grade,
    )
    return gradeOption.map((el) => el.label)[0]
  }, [displayValues])

  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Общая информация
      </Text>
      <div className={styles.cardFields}>
        <Input
          title='Название задания'
          fluid
          value={displayValues.title}
          disabled
          onChange={noop}
        />
        <Input
          title='Проверяющий'
          fluid
          value={displayValues.teacher}
          disabled
          onChange={noop}
        />
        <Input
          title='Исполняющий'
          fluid
          value={displayValues.student}
          disabled
          onChange={noop}
        />
        <Controller
          control={control}
          name='status'
          render={({ field, fieldState }) => (
            <Select
              label='Статус'
              fluid
              required={mode === 'teacher'}
              value={field.value}
              options={statusOptions}
              disabled={disabled}
              onChange={field.onChange}
              isValid={!fieldState.error}
              description={fieldState.error?.message}
            />
          )}
        />
        {mode === 'teacher' && status === 4 ? (
          <Controller
            control={control}
            name='grade'
            render={({ field, fieldState }) => (
              <Select
                label='Оценка'
                fluid
                value={field.value}
                options={GRADE_OPTIONS}
                disabled={disabled}
                onChange={field.onChange}
                isValid={!fieldState.error}
                description={fieldState.error?.message}
              />
            )}
          />
        ) : (
          mode === 'student-view' && (
            <Input
              title='Оценка'
              fluid
              disabled
              value={grade}
              onChange={noop}
            />
          )
        )}
      </div>
    </div>
  )
}

export default TaskGeneral
