import {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { Ref } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodObject, ZodRawShape } from 'zod'
import type { Resolver } from 'react-hook-form'
import { Input, Select, Textarea } from '@/shared/ui'
import { TMemberFullSchema } from '../model/member-fields-schema'
import {
  FIELD_CONFIG,
  INITIAL_FIELDS_VALUES,
  TFieldConfig,
} from '../config/fields-config'
import styles from './styles.module.scss'
import { ROLE_OPTIONS } from '@/shared/config'
import { IMemberFieldsRef } from '../model/types'
import { TPaginatedSelectField } from '@/shared/model'

interface IMemberFormProps {
  ref?: Ref<IMemberFieldsRef>
  schema: ZodObject<ZodRawShape>
  fieldData?: TMemberFullSchema
  disabledFields?: Array<keyof TMemberFullSchema>
  classField: TPaginatedSelectField
  onDirtyChange?: (isDirty: boolean) => void
}

const MemberFields = ({
  schema,
  fieldData = INITIAL_FIELDS_VALUES,
  disabledFields = [],
  onDirtyChange,
  ref,
  classField,
}: IMemberFormProps): ReactNode => {
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false)
  const {
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isDirty },
  } = useForm<TMemberFullSchema>({
    resolver: zodResolver(schema) as unknown as Resolver<TMemberFullSchema>,
    defaultValues: fieldData,
  })
  const fieldsData = watch()

  const onDirtyChangeRef = useRef(onDirtyChange)
  useEffect(() => {
    onDirtyChangeRef.current = onDirtyChange
  })

  useEffect(() => {
    onDirtyChangeRef.current?.(isDirty)
  }, [isDirty])

  const formDataRef = useRef<TMemberFullSchema>(fieldsData)
  formDataRef.current = fieldsData

  useImperativeHandle(
    ref,
    () => ({
      validate: async () => {
        setHasAttemptedValidation(true)
        return trigger()
      },
      getFieldsData: () => formDataRef.current,
      reset: () => {
        reset()
        setHasAttemptedValidation(false)
      },
    }),
    [trigger, reset],
  )

  const renderField = (field: TFieldConfig): ReactNode => {
    const { name, title, required } = field
    const disabled = disabledFields.includes(name)

    const commonProps = {
      required,
      fluid: true,
      disabled,
      isValid: !errors[name],
      description: errors[name]?.message,
    }

    const onChange = (v: string) =>
      setValue(name, v, {
        shouldValidate: hasAttemptedValidation,
        shouldDirty: true,
      })

    switch (field.type) {
      case 'select':
        if (field.name === 'class') {
          return (
            <Select
              key={name}
              {...commonProps}
              label={title}
              placeholder='Выберите'
              options={classField.data}
              searchable
              hasMore={classField.hasMore}
              isLoadingMore={classField.isLoadingMore}
              onLoadMore={classField.onLoadMore}
              onSearchChange={classField.onSearchChange}
              value={fieldsData[name]}
              onChange={onChange}
            />
          )
        }
        return (
          <Select
            key={name}
            {...commonProps}
            label={title}
            placeholder='Выберите'
            options={ROLE_OPTIONS}
            value={fieldsData[name]}
            onChange={onChange}
          />
        )

      case 'textarea':
        return (
          <Textarea
            key={name}
            {...commonProps}
            label={title}
            placeholder='Ввод..'
            resize='none'
            value={fieldsData[name]}
            onChange={onChange}
          />
        )

      case 'input':
        return (
          <Input
            key={name}
            {...commonProps}
            title={title}
            value={fieldsData[name]}
            onChange={onChange}
          />
        )

      default: {
        return null
      }
    }
  }

  return <div className={styles.wrapper}>{FIELD_CONFIG.map(renderField)}</div>
}

export default MemberFields
