import { Input, Select, SelectOption, Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { Controller, useFormContext } from 'react-hook-form'
import { TDisplayValues } from '../../model/types'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { TStatusId } from '@/shared/model'

type TStatusFormFields = {
  status: TStatusId
}

interface ITaskGeneralSectionProps {
  displayValues: TDisplayValues
  statusOptions: SelectOption<TStatusId>[]
}

const noop = () => undefined

const TaskGeneral = (props: ITaskGeneralSectionProps) => {
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role
  const { displayValues, statusOptions } = props
  const { control } = useFormContext<TStatusFormFields>()

  const mappedStatusOptions = statusOptions.map((el) =>
    el.value === 4 && role === 'student' ? { ...el, disabled: true } : el,
  )

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
          onChange={noop}
          disabled
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
              value={field.value}
              options={mappedStatusOptions}
              disabled={displayValues.status === 4 && role === 'student'}
              onChange={field.onChange}
              isValid={!fieldState.error}
              description={fieldState.error?.message}
            />
          )}
        />
      </div>
    </div>
  )
}

export default TaskGeneral
