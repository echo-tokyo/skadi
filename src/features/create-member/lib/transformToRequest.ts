import { ICreateMemberRequest } from '@/entities/member'
import { TCreateMemberFormData } from '../model/schemas'

export const transformToRequest = (
  data: TCreateMemberFormData,
): ICreateMemberRequest => {
  return {
    // TODO: добавить class_id
    username: data.username,
    password: data.password,
    role: data.role,
    profile: {
      fullname: data.fullname,
      address: data.address,
      contact: { email: data.email, phone: data.phone },
      parentContact: { email: data.parentEmail, phone: data.parentPhone },
      extra: data.extra,
    },
  }
}
