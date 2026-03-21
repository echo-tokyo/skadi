import { Input, Select, SelectOption } from '@/shared/ui'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import type { TClassSchema } from '../model/class-form-schema'
import { classSchema } from '../model/class-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { INITIAL_FIELDS_VALUES } from '../config/fields-config'

type TPaginatedSelectField = {
  data: SelectOption[]
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}

interface IClassFieldsProps {
  fieldValues?: TClassSchema
  teacherField: TPaginatedSelectField
  studentField: TPaginatedSelectField
}

const ClassFields = (props: IClassFieldsProps) => {
  const {
    fieldValues = INITIAL_FIELDS_VALUES,
    teacherField,
    studentField,
  } = props

  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm<TClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: fieldValues,
  })

  const fieldsData = watch()

  return (
    <div className={styles.wrapper}>
      <Input
        fluid
        title='Название группы'
        required
        isValid={!errors['className']}
        description={errors['className']?.message}
        value={fieldsData['className']}
        onChange={(val) =>
          setValue('className', val, {
            shouldValidate: true,
          })
        }
      />
      <Select
        fluid
        label='Преподаватель'
        isValid={!errors['teacher']}
        placeholder='Выберите'
        description={errors['teacher']?.message}
        options={teacherField.data}
        value={fieldsData['teacher']}
        searchable
        onLoadMore={teacherField.onLoadMore}
        hasMore={teacherField.hasMore}
        isLoadingMore={teacherField.isLoadingMore}
        onChange={(v) =>
          setValue('teacher', v, {
            shouldValidate: true,
          })
        }
      />
      <Select
        fluid
        label='Ученики'
        isValid={!errors['students']}
        multiple
        placeholder='Выберите'
        description={errors['students']?.message}
        options={studentField.data}
        value={fieldsData['students']}
        searchable
        onLoadMore={studentField.onLoadMore}
        hasMore={studentField.hasMore}
        isLoadingMore={studentField.isLoadingMore}
        onChange={(v) =>
          setValue('students', v, {
            shouldValidate: true,
          })
        }
      />
      <Input
        fluid
        title='Расписание'
        placeholder='Каждый четверг, 18:00 - 19:00'
        isValid={!errors['schedule']}
        description={errors['schedule']?.message}
        value={fieldsData['schedule']}
        onChange={(val) =>
          setValue('schedule', val, {
            shouldValidate: true,
          })
        }
      />
    </div>
  )
}

export default ClassFields
