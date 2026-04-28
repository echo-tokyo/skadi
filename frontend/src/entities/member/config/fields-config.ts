import { TMemberFormData } from '../model/member-fields-schema'

type TInputFieldName = Exclude<
  keyof TMemberFormData,
  'role' | 'extra' | 'class'
>

export type TFieldConfig =
  | { type: 'input'; name: TInputFieldName; title: string; required?: boolean }
  | { type: 'select'; name: 'role'; title: string; required?: boolean }
  | { type: 'select'; name: 'class'; title: string; required?: boolean }
  | { type: 'textarea'; name: 'extra'; title: string; required?: boolean }

// Значения если не передан fieldData
export const INITIAL_FIELDS_VALUES: TMemberFormData = {
  fullname: '',
  role: 'student',
  class: '',
  username: '',
  password: '',
  address: '',
  email: '',
  phone: '',
  parentEmail: '',
  parentPhone: '',
  extra: '',
}

// Поля для маппинга
export const FIELD_CONFIG: TFieldConfig[] = [
  { type: 'input', name: 'fullname', title: 'ФИО', required: true },
  { type: 'select', name: 'role', title: 'Роль', required: true },
  { type: 'input', name: 'username', title: 'Логин', required: true },
  { type: 'input', name: 'password', title: 'Пароль', required: true },
  { type: 'select', name: 'class', title: 'Группа' },
  { type: 'input', name: 'address', title: 'Адрес проживания' },
  { type: 'input', name: 'email', title: 'Email' },
  { type: 'input', name: 'phone', title: 'Телефон' },
  { type: 'input', name: 'parentEmail', title: 'Email родителя' },
  { type: 'input', name: 'parentPhone', title: 'Телефон родителя' },
  { type: 'textarea', name: 'extra', title: 'Дополнительная информация' },
]

// Disabled поля при редактировании
export const BASE_DISABLED_FIELDS: Array<keyof TMemberFormData> = [
  'role',
  'username',
]
