import { TProfile } from '@/shared/model'
import { TMemberFullSchema } from '../model/member-fields-schema'

export const toProfile = (data: TMemberFullSchema): TProfile => ({
  // TODO: добавить класс
  fullname: data.fullname,
  address: data.address,
  contact: { email: data.email, phone: data.phone },
  parentContact: { email: data.parentEmail, phone: data.parentPhone },
  extra: data.extra,
})
