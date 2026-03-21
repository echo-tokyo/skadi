import {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { Ref } from 'react'
import { Input, Select, SelectOption } from '@/shared/ui'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { classSchema } from '../model/class-form-schema'
import type { TClassSchema } from '../model/class-form-schema'
import { INITIAL_FIELDS_VALUES } from '../config/fields-config'
import { IClassFieldsRef } from '../model/types'

type TPaginatedSelectField = {
  data: SelectOption[]
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}

interface IClassFieldsProps {
  ref?: Ref<IClassFieldsRef>
  fieldValues?: TClassSchema
  teacherField: TPaginatedSelectField
  studentField: TPaginatedSelectField
  onDirtyChange?: (isDirty: boolean) => void
}

const ClassFields = ({
  fieldValues = INITIAL_FIELDS_VALUES,
  teacherField,
  studentField,
  onDirtyChange,
  ref,
}: IClassFieldsProps): ReactNode => {
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false)

  const {
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isDirty },
  } = useForm<TClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: fieldValues,
  })

  const className = watch('className')
  const teacher = watch('teacher')
  const students = watch('students')
  const schedule = watch('schedule')

  const onDirtyChangeRef = useRef(onDirtyChange)

  useEffect(() => {
    onDirtyChangeRef.current?.(isDirty)
  }, [isDirty])

  useImperativeHandle(ref, () => ({
    validate: async () => {
      setHasAttemptedValidation(true)
      return trigger()
    },
    getFieldsData: () => ({
      className,
      teacher,
      students,
      schedule,
    }),
    reset: () => {
      reset()
      setHasAttemptedValidation(false)
    },
  }))

  return (
    <div className={styles.wrapper}>
      <Input
        fluid
        title='Название группы'
        required
        isValid={!errors['className']}
        description={errors['className']?.message}
        value={className}
        onChange={(val) =>
          setValue('className', val, {
            shouldValidate: hasAttemptedValidation,
            shouldDirty: true,
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
        value={teacher}
        searchable
        onLoadMore={teacherField.onLoadMore}
        hasMore={teacherField.hasMore}
        isLoadingMore={teacherField.isLoadingMore}
        onChange={(v) =>
          setValue('teacher', v, {
            shouldValidate: hasAttemptedValidation,
            shouldDirty: true,
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
        value={students}
        searchable
        onLoadMore={studentField.onLoadMore}
        hasMore={studentField.hasMore}
        isLoadingMore={studentField.isLoadingMore}
        onChange={(v) =>
          setValue('students', v, {
            shouldValidate: hasAttemptedValidation,
            shouldDirty: true,
          })
        }
      />
      <Input
        fluid
        title='Расписание'
        placeholder='Каждый четверг, 18:00 - 19:00'
        isValid={!errors['schedule']}
        description={errors['schedule']?.message}
        value={schedule}
        onChange={(val) =>
          setValue('schedule', val, {
            shouldValidate: hasAttemptedValidation,
            shouldDirty: true,
          })
        }
      />
    </div>
  )
}

export default ClassFields
