import { Input, Select, SelectOption, Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { useFormContext } from 'react-hook-form'
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

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TStatusFormFields>()

  const statusValue = watch('status')

  return (
    <div className={styles.card}>
      <Text size='20' weight='bold'>
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
        {/* FIXME: константа или выбор (?) */}
        <Select
          label='Проверяющий'
          fluid
          value={'Преподаватель'}
          options={[{ label: 'Преподаватель', value: 'Преподаватель' }]}
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
        <Select
          label='Статус'
          fluid
          value={statusValue}
          options={statusOptions}
          onChange={(v) =>
            setValue('status', v as TStatusValue, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          isValid={!errors['status']}
          description={errors['status']?.message}
        />
      </div>
    </div>
  )
}

export default TaskGeneral
