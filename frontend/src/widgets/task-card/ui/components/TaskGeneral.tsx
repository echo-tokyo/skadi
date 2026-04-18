import { Input, Select, SelectOption, Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { Controller, useFormContext } from 'react-hook-form'
import { TStatusValue } from '@/shared/model'
import { TDisplayValues } from '../../model/types'

type TStatusFormFields = {
  status: TStatusValue
}

interface ITaskGeneralSectionProps {
  displayValues: TDisplayValues
  statusOptions: SelectOption<TStatusValue>[]
}

const noop = () => undefined

const TaskGeneral = (props: ITaskGeneralSectionProps) => {
  const { displayValues, statusOptions } = props
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
              options={statusOptions}
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
