import { ROLE_OPTIONS } from '@/entities/member'
import { TRole } from '@/shared/model'
import { Input, Select, Textarea } from '@/shared/ui'
import { ReactNode, useImperativeHandle, forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createMemberSchema, TCreateMemberFormData } from '../model/schemas'
import {
  FIELD_CONFIG,
  INITIAL_FORM_DATA,
  TFieldConfig,
} from '../config/form-config'
import styles from './styles.module.scss'

export interface ICreateMemberDialogRef {
  validate: () => Promise<boolean>
  getFormData: () => TCreateMemberFormData
  reset: () => void
}

// FIXME: deprecated forwardRef
const CreateMemberDialog = forwardRef<ICreateMemberDialogRef>(
  (_, ref): ReactNode => {
    const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false)

    const { watch, setValue, trigger, reset, formState } =
      useForm<TCreateMemberFormData>({
        resolver: zodResolver(createMemberSchema),
        defaultValues: INITIAL_FORM_DATA,
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

      if (field.type === 'select') {
        return (
          <Select
            key={name}
            label={title}
            placeholder='Выберите'
            isValid={!errors[name]}
            required={required}
            fluid
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

CreateMemberDialog.displayName = 'CreateMemberDialog'

export default CreateMemberDialog
