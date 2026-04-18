import { ReactNode, useEffect, useImperativeHandle, useRef } from 'react'
import type { Ref } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, Textarea } from '@/shared/ui'
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
  const {
    control,
    trigger,
    reset,
    getValues,
    handleSubmit,
    formState: { isDirty },
  } = useForm<TTaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: fieldData ?? defaultValues,
  })

  const onDirtyChangeRef = useRef(onDirtyChange)
  useEffect(() => {
    onDirtyChangeRef.current = onDirtyChange
  })

  useEffect(() => {
    onDirtyChangeRef.current?.(isDirty)
  }, [isDirty])

  useImperativeHandle(
    ref,
    () => ({
      validate: () =>
        new Promise((resolve) =>
          handleSubmit(
            () => resolve(true),
            () => resolve(false),
          )(),
        ),
      getFieldsData: () => getValues(),
      reset: () => reset(),
    }),
    [trigger, reset, getValues],
  )

  return (
    <div className={styles.content}>
      <Controller
        control={control}
        name='title'
        render={({ field, fieldState }) => (
          <Input
            ref={field.ref}
            fluid
            title='Название'
            required
            isValid={!fieldState.error}
            description={fieldState.error?.message}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name='students'
        render={({ field, fieldState }) => (
          <Select
            ref={field.ref}
            fluid
            label='Ученики'
            multiple
            placeholder='Выберите'
            isValid={!fieldState.error}
            description={fieldState.error?.message}
            options={studentField.data}
            selectedOptions={studentField.selectedOptions}
            value={field.value}
            searchable
            onLoadMore={studentField.onLoadMore}
            hasMore={studentField.hasMore}
            isLoadingMore={studentField.isLoadingMore}
            onSearchChange={studentField.onSearchChange}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name='description'
        render={({ field, fieldState }) => (
          <Textarea
            ref={field.ref}
            label='Описание'
            fluid
            required
            isValid={!fieldState.error}
            description={fieldState.error?.message}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  )
}

export default TaskFields
