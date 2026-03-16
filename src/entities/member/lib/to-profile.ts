import { TProfile } from '@/shared/model'
import { TMemberFullSchema } from '../model/member-form-schema'

export const toProfile = (data: TMemberFullSchema): TProfile => ({
  fullname: data.fullname,
  address: data.address,
  contact: { email: data.email, phone: data.phone },
  parentContact: { email: data.parentEmail, phone: data.parentPhone },
  extra: data.extra,
})
