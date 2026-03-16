import { IMember, TMemberFullSchema } from '@/entities/member'

export const toFormData = (member: IMember): TMemberFullSchema => ({
  fullname: member.profile?.fullname ?? '',
  role: member.role,
  username: member.username,
  password: '',
  address: member.profile?.address ?? '',
  email: member.profile?.contact?.email ?? '',
  phone: member.profile?.contact?.phone ?? '',
  parentEmail: member.profile?.parentContact?.email ?? '',
  parentPhone: member.profile?.parentContact?.phone ?? '',
  extra: member.profile?.extra ?? '',
})
