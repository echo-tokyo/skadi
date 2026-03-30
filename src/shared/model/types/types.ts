import { SelectOption } from '@/shared/ui'

export type TRole = 'admin' | 'teacher' | 'student'

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
  id: number
  address?: string
  contact?: TContact
  extra?: string
  fullname: string
  parentContact?: TContact
}

export type TPaginatedSelectField = {
  data: SelectOption[]
  selectedOptions?: SelectOption[]
  onSearchChange?: (query: string) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}
