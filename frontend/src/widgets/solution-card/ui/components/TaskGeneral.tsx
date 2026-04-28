import { Input, Select, SelectOption, Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { Controller, useFormContext } from 'react-hook-form'
import { TDisplayValues } from '../../model/types'
import { TStatusId } from '@/shared/model'

type TStatusFormFields = {
  status: TStatusId
}

interface ITaskGeneralSectionProps {
  displayValues: TDisplayValues
  statusOptions: SelectOption<TStatusId>[]
  disabled?: boolean
}

const noop = () => undefined

const TaskGeneral = ({ displayValues, statusOptions, disabled = false }: ITaskGeneralSectionProps) => {
  const { control } = useFormContext<TStatusFormFields>()

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
              value={field.value}
              options={statusOptions}
              disabled={disabled}
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
