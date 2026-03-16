import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodObject, ZodRawShape } from 'zod'
import type { Resolver } from 'react-hook-form'
import { Input, Select, Textarea } from '@/shared/ui'
import { TRole } from '@/shared/model'
import { ROLE_OPTIONS } from '../config/role-options'
import { TMemberFullSchema } from '../model/member-form-schema'
import {
  FIELD_CONFIG,
  INITIAL_FORM_DATA,
  TFieldConfig,
} from '../config/form-config'
import styles from './styles.module.scss'

export interface IMemberFormRef {
  validate: () => Promise<boolean>
  getFormData: () => TMemberFullSchema
  reset: () => void
}

interface IMemberFormProps {
  schema: ZodObject<ZodRawShape>
  fieldData?: TMemberFullSchema
  disabledFields?: Array<keyof TMemberFullSchema>
}

// TODO: нужно добавить проверку на то, изменялись ли поля
// FIXME: deprecated forwardRef
const MemberForm = forwardRef<IMemberFormRef, IMemberFormProps>(
  (
    { schema, fieldData = INITIAL_FORM_DATA, disabledFields = [] },
    ref,
  ): ReactNode => {
    const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false)

    const { watch, setValue, trigger, reset, formState } =
      useForm<TMemberFullSchema>({
        resolver: zodResolver(schema) as unknown as Resolver<TMemberFullSchema>,
        defaultValues: fieldData,
      })

    const formData = watch()
    const { errors } = formState

    useImperativeHandle(ref, () => ({
      validate: async () => {
        setHasAttemptedValidation(true)
        return trigger()
      },
      getFormData: () => formData,
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
            value={formData[name]}
            onChange={(v) =>
              setValue(name, v as TRole, {
                shouldValidate: hasAttemptedValidation,
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
            value={formData[name]}
            onChange={(v) =>
              setValue(name, v, {
                shouldValidate: hasAttemptedValidation,
              })
            }
          />
        )
      }

      return (
        <Input
          key={name}
          title={title}
          value={formData[name]}
          isValid={!errors[name]}
          required={required}
          fluid
          disabled={disabled}
          description={errors[name]?.message}
          onChange={(v) =>
            setValue(name, v, { shouldValidate: hasAttemptedValidation })
          }
        />
      )
    }

    return <div className={styles.wrapper}>{FIELD_CONFIG.map(renderField)}</div>
  },
)

MemberForm.displayName = 'MemberForm'

export default MemberForm
