import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodObject, ZodRawShape } from 'zod'
import type { Resolver } from 'react-hook-form'
import { Input, Select, Textarea } from '@/shared/ui'
import { TRole } from '@/shared/model'
import { TMemberFullSchema } from '../model/member-fields-schema'
import {
  FIELD_CONFIG,
  INITIAL_FIELDS_VALUES,
  TFieldConfig,
} from '../config/fields-config'
import styles from './styles.module.scss'
import { ROLE_OPTIONS } from '@/shared/config/role-options'

export interface IMemberFieldsRef {
  validate: () => Promise<boolean>
  getFieldsData: () => TMemberFullSchema
  reset: () => void
}

interface IMemberFormProps {
  schema: ZodObject<ZodRawShape>
  fieldData?: TMemberFullSchema
  disabledFields?: Array<keyof TMemberFullSchema>
  onDirtyChange?: (isDirty: boolean) => void
}

// FIXME: deprecated forwardRef
const MemberFields = forwardRef<IMemberFieldsRef, IMemberFormProps>(
  (
    {
      schema,
      fieldData = INITIAL_FIELDS_VALUES,
      disabledFields = [],
      onDirtyChange,
    },
    ref,
  ): ReactNode => {
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

    useEffect(() => {
      if (onDirtyChange) {
        onDirtyChange(isDirty)
      }
    }, [fieldsData, onDirtyChange])

    useImperativeHandle(ref, () => ({
      validate: async () => {
        setHasAttemptedValidation(true)
        return trigger()
      },
      getFieldsData: () => fieldsData,
      reset: () => {
        reset()
        setHasAttemptedValidation(false)
      },
    }))

    const renderField = (field: TFieldConfig) => {
      const { name, title, required } = field
      const disabled = disabledFields.includes(name)

      if (field.type === 'select') {
        return (
          <Select
            key={name}
            label={title}
            placeholder='Выберите'
            isValid={!errors[name]}
            required={required}
            fluid
            disabled={disabled}
            description={errors[name]?.message}
            options={ROLE_OPTIONS}
            value={fieldsData[name]}
            onChange={(v) =>
              setValue(name, v as TRole, {
                shouldValidate: hasAttemptedValidation,
                shouldDirty: true,
              })
            }
          />
        )
      }

      if (field.type === 'textarea') {
        return (
          <Textarea
            key={name}
            label={title}
            placeholder='Ввод..'
            isValid={!errors[name]}
            required={required}
            fluid
            disabled={disabled}
            description={errors[name]?.message}
            resize='none'
            value={fieldsData[name]}
            onChange={(v) =>
              setValue(name, v, {
                shouldValidate: hasAttemptedValidation,
                shouldDirty: true,
              })
            }
          />
        )
      }

      return (
        <Input
          key={name}
          title={title}
          value={fieldsData[name]}
          isValid={!errors[name]}
          required={required}
          fluid
          disabled={disabled}
          description={errors[name]?.message}
          onChange={(v) =>
            setValue(name, v, {
              shouldValidate: hasAttemptedValidation,
              shouldDirty: true,
            })
          }
        />
      )
    }

    return <div className={styles.wrapper}>{FIELD_CONFIG.map(renderField)}</div>
  },
)

MemberFields.displayName = 'MemberFields'

export default MemberFields
