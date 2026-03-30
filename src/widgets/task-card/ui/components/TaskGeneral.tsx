import { STATUS_OPTIONS } from '@/shared/config/selects-options'
import { Input, Select, Text } from '@/shared/ui'
import styles from '../styles.module.scss'
import { useFormContext } from 'react-hook-form'
import { TPaginatedSelectField } from '@/shared/model'

interface ITaskGeneralSectionProps {
  studentOptions: TPaginatedSelectField
}

const TaskGeneral = (props: ITaskGeneralSectionProps) => {
  const { studentOptions } = props

  const { watch, setValue } = useFormContext()
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
          value={fieldsData.title}
          onChange={(v) => setValue('title', v)}
        />
        <Select
          label='Проверяющий'
          fluid
          value={'Вы'}
          options={[{ label: 'Фиксированное ФИО', value: 'Вы' }]}
          onChange={() => ''}
          disabled
        />
        <Select
          label='Исполняющий'
          fluid
          multiple
          searchable
          value={fieldsData.students}
          options={studentOptions.data}
          hasMore={studentOptions.hasMore}
          isLoadingMore={studentOptions.isLoadingMore}
          onLoadMore={studentOptions.onLoadMore}
          onSearchChange={studentOptions.onSearchChange}
          onChange={(v) => setValue('students', v)}
        />
        <Select
          label='Статус'
          fluid
          value={fieldsData.status}
          options={STATUS_OPTIONS}
          onChange={(v) => setValue('status', v)}
          disabled
        />
      </div>
    </div>
  )
}

export default TaskGeneral
