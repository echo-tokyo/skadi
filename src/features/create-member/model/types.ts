import { TRole } from '@/shared/model'

export interface CreateMemberFormData {
  fullname: string
  role: TRole
  username: string
  password: string
  address: string
  email: string
  phone: string
  parentEmail: string
  parentPhone: string
  extra: string
}
