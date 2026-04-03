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

export type TTask = {
  description?: string
  id: number
  teacher?: TProfile
  title: string
}

export type TStatusName = 'Бэклог' | 'В работе' | 'На проверке' | 'Проверено'

export type TStatus = {
  id?: number
  name: TStatusName
}

export type TSolution = {
  answer?: string
  grade?: string
  id: number
  status: TStatus
  student?: TProfile
  task: TTask
  updated_at: string
}

export type TPagination = {
  page: number
  per_page: number
  pages: number
  total: number
}

export type TPaginatedSelectField = {
  data: SelectOption[]
  selectedOptions?: SelectOption[]
  onSearchChange?: (query: string) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}
