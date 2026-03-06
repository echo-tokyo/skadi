import { TCreateMemberFormData } from '../model/schemas'

type TInputFieldName = Exclude<keyof TCreateMemberFormData, 'role' | 'extra'>

export type TFieldConfig =
  | {
      type: 'input'
      name: TInputFieldName
      title: string
      required?: boolean
    }
  | { type: 'select'; name: 'role'; title: string; required?: boolean }
  | { type: 'textarea'; name: 'extra'; title: string; required?: boolean }

export const INITIAL_FORM_DATA: TCreateMemberFormData = {
  fullname: '',
  role: 'student',
  username: '',
  password: '',
  address: '',
  email: '',
  phone: '',
  parentEmail: '',
  parentPhone: '',
  extra: '',
}

export const FIELD_CONFIG: TFieldConfig[] = [
  { type: 'input', name: 'fullname', title: 'ФИО', required: true },
  { type: 'select', name: 'role', title: 'Роль', required: true },
  { type: 'input', name: 'username', title: 'Логин', required: true },
  { type: 'input', name: 'password', title: 'Пароль', required: true },
  { type: 'input', name: 'address', title: 'Адрес проживания' },
  { type: 'input', name: 'email', title: 'Email' },
  { type: 'input', name: 'phone', title: 'Телефон' },
  { type: 'input', name: 'parentEmail', title: 'Email родителя' },
  { type: 'input', name: 'parentPhone', title: 'Телефон родителя' },
  { type: 'textarea', name: 'extra', title: 'Дополнительная информация' },
]
