import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { Ref } from 'react'
import { useForm, useFormState, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Control, Resolver } from 'react-hook-form'
import { Input, Select, Textarea } from '@/shared/ui'
import {
  TMemberFormData,
  studentSchema,
  teacherSchema,
  studentFullSchema,
  teacherFullSchema,
} from '../model/member-fields-schema'
import {
  BASE_DISABLED_FIELDS,
  FIELD_CONFIG,
  INITIAL_FIELDS_VALUES,
  TFieldConfig,
} from '../config/fields-config'
import styles from './styles.module.scss'
import { ROLE_OPTIONS } from '@/shared/config'
import { IMemberFieldsRef } from '../model/types'
import { TPaginatedSelectField } from '@/shared/ui'

interface IMemberFormProps {
  ref?: Ref<IMemberFieldsRef>
  mode: 'create' | 'update'
  fieldData?: TMemberFormData
  classField: TPaginatedSelectField
  onDirtyChange?: (isDirty: boolean) => void
}

interface IFieldItemProps {
  field: TFieldConfig
  control: Control<TMemberFormData>
  disabled: boolean
  onChange: (name: keyof TMemberFormData, value: string) => void
  classField: TPaginatedSelectField
}

const FieldItem = memo(
  ({
    field,
    control,
    disabled,
    onChange,
    classField,
  }: IFieldItemProps): ReactNode => {
    const { name, title, required } = field

    const value = useWatch({ control, name }) ?? ''
    const { errors } = useFormState({ control, name })
    const fieldError = errors[name]

    const commonProps = {
      required,
      fluid: true,
      disabled,
      isValid: !fieldError,
      description: fieldError?.message as string | undefined,
    }

    const handleChange = useCallback(
      (v: string) => onChange(name, v),
      [name, onChange],
    )

    switch (field.type) {
      case 'select':
        if (field.name === 'class') {
          return (
            <Select
              {...commonProps}
              label={title}
              placeholder='Выберите'
              options={classField.data}
              searchable
              hasMore={classField.hasMore}
              isLoadingMore={classField.isLoadingMore}
              onLoadMore={classField.onLoadMore}
              onSearchChange={classField.onSearchChange}
              value={value}
              onChange={handleChange}
            />
          )
        }
        return (
          <Select
            {...commonProps}
            label={title}
            placeholder='Выберите'
            options={ROLE_OPTIONS}
            value={value}
            onChange={handleChange}
          />
        )

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            label={title}
            placeholder='Ввод..'
            resize='none'
            value={value}
            onChange={handleChange}
          />
        )

      case 'input':
        return (
          <Input
            {...commonProps}
            title={title}
            value={value}
            onChange={handleChange}
          />
        )

      default:
        return null
    }
  },

  (prev, next) => {
    if (
      prev.field !== next.field ||
      prev.control !== next.control ||
      prev.disabled !== next.disabled ||
      prev.onChange !== next.onChange
    ) {
      return false
    }

    if (prev.field.name === 'class') {
      return (
        prev.classField.data === next.classField.data &&
        prev.classField.hasMore === next.classField.hasMore &&
        prev.classField.isLoadingMore === next.classField.isLoadingMore &&
        prev.classField.onLoadMore === next.classField.onLoadMore &&
        prev.classField.onSearchChange === next.classField.onSearchChange
      )
    }

    return true
  },
)

FieldItem.displayName = 'FieldItem'

const MemberFields = ({
  mode,
  fieldData = INITIAL_FIELDS_VALUES,
  onDirtyChange,
  ref,
  classField,
}: IMemberFormProps): ReactNode => {
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false)

  const hasAttemptedValidationRef = useRef(hasAttemptedValidation)
  hasAttemptedValidationRef.current = hasAttemptedValidation

  const resolver = useCallback(
    async (
      data: TMemberFormData,
      context: unknown,
      options: Parameters<Resolver<TMemberFormData>>[2],
    ) => {
      const schema =
        mode === 'update'
          ? data.role === 'teacher'
            ? teacherSchema
            : studentSchema
          : data.role === 'teacher'
            ? teacherFullSchema
            : studentFullSchema

      return (zodResolver(schema) as unknown as Resolver<TMemberFormData>)(
        data,
        context,
        options,
      )
    },
    [mode],
  )

  const {
    control,
    setValue,
    resetField,
    trigger,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm<TMemberFormData>({
    resolver,
    defaultValues: fieldData,
  })

  const role = useWatch({ control, name: 'role' })

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
      validate: async () => {
        setHasAttemptedValidation(true)
        return trigger()
      },
      getFieldsData: () => getValues(),
      reset: () => {
        reset()
        setHasAttemptedValidation(false)
      },
    }),
    [trigger, reset, getValues],
  )

  const handleFieldChange = useCallback(
    (name: keyof TMemberFormData, value: string) => {
      if (name === 'role' && value === 'teacher') {
        resetField('class')
      }
      setValue(name, value, {
        shouldValidate: hasAttemptedValidationRef.current,
        shouldDirty: true,
      })
    },
    [setValue, resetField],
  )

  const disabledFields = mode === 'update' ? BASE_DISABLED_FIELDS : []

  const visibleFields = FIELD_CONFIG.filter(
    (f) => !(f.name === 'class' && role === 'teacher'),
  )

  return (
    <div className={styles.wrapper}>
      {visibleFields.map((field) => (
        <FieldItem
          key={field.name}
          field={field}
          control={control}
          disabled={disabledFields.includes(field.name)}
          onChange={handleFieldChange}
          classField={classField}
        />
      ))}
    </div>
  )
}

export default MemberFields
