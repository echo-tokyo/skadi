import { Input, Select, Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { useFormContext } from 'react-hook-form'
import { TPaginatedSelectField } from '@/shared/model'
import { TDisplayValues } from '../../model/types'
import { STATUS_OPTIONS } from '@/shared/config/selects-options'

interface ITaskGeneralSectionProps {
  studentOptions: TPaginatedSelectField
  taskValues: TDisplayValues
}

const TaskGeneral = (props: ITaskGeneralSectionProps) => {
  const { studentOptions, taskValues } = props

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

  const fieldsData = watch()

  return (
    <div className={styles.card}>
      <Text size='20' weight='bold'>
        Общая информация
      </Text>
      <div className={styles.cardFields}>
        <Input
          title='Название задания'
          fluid
          value={taskValues.title}
          disabled
          onChange={() => ''}
        />
        <Select
          label='Проверяющий'
          fluid
          value={'Вы'}
          options={[{ label: 'Вы', value: 'Вы' }]}
          onChange={() => ''}
          disabled
        />
        <Select
          label='Исполняющий'
          fluid
          value={taskValues.student}
          disabled
          options={studentOptions.data}
          onChange={() => ''}
        />
        <Select
          label='Статус'
          fluid
          value={fieldsData.status}
          options={STATUS_OPTIONS}
          onChange={(v) =>
            setValue('status', v, { shouldDirty: true, shouldValidate: true })
          }
          isValid={!errors['status']}
          description={errors['status']?.message as string}
        />
      </div>
    </div>
  )
}

export default TaskGeneral
