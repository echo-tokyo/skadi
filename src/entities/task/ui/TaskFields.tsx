import {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { Ref } from 'react'
import { Input, Select, Textarea } from '@/shared/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TPaginatedSelectField } from '@/shared/ui'
import { ITaskFieldsRef } from '../model/types'
import styles from './styles.module.scss'
import { taskSchema, TTaskSchema } from '../model/schema'
import { defaultValues } from '../config/default-values'

interface ITaskFieldsProps {
  ref?: Ref<ITaskFieldsRef>
  studentField: TPaginatedSelectField
  onDirtyChange?: (isDirty: boolean) => void
  fieldData?: TTaskSchema
}

const TaskFields = ({
  ref,
  studentField,
  onDirtyChange,
  fieldData,
}: ITaskFieldsProps): ReactNode => {
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false)

  const {
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isDirty },
  } = useForm<TTaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: fieldData ?? defaultValues,
  })

  const title = watch('title')
  const description = watch('description')
  const students = watch('students')

  const onDirtyChangeRef = useRef(onDirtyChange)

  useEffect(() => {
    onDirtyChangeRef.current?.(isDirty)
  }, [isDirty])

  useImperativeHandle(ref, () => ({
    validate: async () => {
      setHasAttemptedValidation(true)
      return trigger()
    },
    getFieldsData: () => ({ title, description, students }),
    reset: () => {
      reset()
      setHasAttemptedValidation(false)
    },
  }))

  return (
    <div className={styles.content}>
      <Input
        fluid
        title='Название'
        required
        isValid={!errors.title}
        description={errors.title?.message}
        value={title}
        onChange={(val) =>
          setValue('title', val, {
            shouldValidate: hasAttemptedValidation,
            shouldDirty: true,
          })
        }
      />
      <Select
        label='Проверяющий'
        fluid
        required
        value={'Вы'}
        options={[{ label: 'Вы', value: 'Вы' }]}
        onChange={() => ''}
        disabled
      />
      <Select
        fluid
        label='Ученики'
        multiple
        placeholder='Выберите'
        isValid={!errors.students}
        description={errors.students?.message}
        options={studentField.data}
        selectedOptions={studentField.selectedOptions}
        value={students}
        searchable
        onLoadMore={studentField.onLoadMore}
        hasMore={studentField.hasMore}
        isLoadingMore={studentField.isLoadingMore}
        onSearchChange={studentField.onSearchChange}
        onChange={(v) =>
          setValue('students', v, {
            shouldValidate: hasAttemptedValidation,
            shouldDirty: true,
          })
        }
      />
      <Textarea
        label='Описание'
        fluid
        required
        value={description}
        isValid={!errors.description}
        description={errors.description?.message as string}
        onChange={(val) =>
          setValue('description', val, {
            shouldValidate: hasAttemptedValidation,
            shouldDirty: true,
          })
        }
      />
    </div>
  )
}

export default TaskFields
