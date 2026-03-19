import { ROLES } from '@/shared/config'

export type TRole = (typeof ROLES)[number]

type TContact = { email: string; phone: string }

type TTeacherProfile = Omit<TProfile, 'class'>

export type TClass = {
  id: number
  name: string
  schedule?: string
  students?: TProfile[]
  teacher?: TTeacherProfile
}

export type TProfile = {
  class?: TClass
  address?: string
  contact?: TContact
  extra?: string
  fullname: string
  parentContact?: TContact
}
