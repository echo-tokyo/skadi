import { ROLE_OPTIONS } from '@/entities/member'
import { TRole } from '@/shared/model'
import { Input, Select } from '@/shared/ui'
import { ReactNode, useState, useImperativeHandle, forwardRef } from 'react'
import { CreateMemberFormData } from '../model/types'
import { INITIAL_FORM_DATA } from '../config/initial-form-data'

export interface CreateMemberDialogRef {
  getFormData: () => CreateMemberFormData
  reset: () => void
}

const CreateMemberDialog = forwardRef<CreateMemberDialogRef>(
  (_, ref): ReactNode => {
    const [formData, setFormData] =
      useState<CreateMemberFormData>(INITIAL_FORM_DATA)

    const updateField = <K extends keyof CreateMemberFormData>(
      field: K,
      value: CreateMemberFormData[K],
    ): void => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    useImperativeHandle(ref, () => ({
      getFormData: () => formData,
      reset: () => setFormData(INITIAL_FORM_DATA),
    }))

    return (
      <div>
        <Input
          title='ФИО'
          value={formData.fullname}
          onChange={(v) => updateField('fullname', v)}
        />
        <Select
          label='Роль'
          placeholder='Выберите'
          options={ROLE_OPTIONS}
          value={formData.role}
          onChange={(v) => updateField('role', v as TRole)}
        />
        <Input
          title='Логин'
          value={formData.username}
          onChange={(v) => updateField('username', v)}
        />
        <Input
          title='Пароль'
          value={formData.password}
          onChange={(v) => updateField('password', v)}
        />
        <Input
          title='Адрес проживания'
          value={formData.address}
          onChange={(v) => updateField('address', v)}
        />
        <Input
          title='Email'
          value={formData.email}
          onChange={(v) => updateField('email', v)}
        />
        <Input
          title='Телефон'
          value={formData.phone}
          onChange={(v) => updateField('phone', v)}
        />
        <Input
          title='Email родителя'
          value={formData.parentEmail}
          onChange={(v) => updateField('parentEmail', v)}
        />
        <Input
          title='Телефон родителя'
          value={formData.parentPhone}
          onChange={(v) => updateField('parentPhone', v)}
        />
        {/* TODO: сделать textarea */}
        <Input
          title='Допольнительная информация'
          value={formData.extra}
          onChange={(v) => updateField('extra', v)}
        />
      </div>
    )
  },
)

CreateMemberDialog.displayName = 'CreateMemberDialog'

export default CreateMemberDialog
