import { ICreateMemberRequest } from '@/entities/member'
import { CreateMemberFormData } from '../model/types'

export const transformToRequest = (
  data: CreateMemberFormData,
): ICreateMemberRequest => {
  return {
    // TODO: добавить class_id
    username: data.username,
    password: data.password,
    role: data.role,
    profile: {
      fullname: data.fullname,
      address: data.address || undefined,
      contact:
        data.email || data.phone
          ? { email: data.email, phone: data.phone }
          : undefined,
      parentContact:
        data.parentEmail || data.parentPhone
          ? { email: data.parentEmail, phone: data.parentPhone }
          : undefined,
    },
  }
}
