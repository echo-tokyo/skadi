import {
  ICreateMemberRequest,
  TMemberFullSchema,
  toProfile,
} from '@/entities/member'

export const transformToRequest = (
  data: TMemberFullSchema,
): ICreateMemberRequest => ({
  // TODO: добавить class_id
  classId: undefined,
  username: data.username,
  password: data.password,
  role: data.role,
  profile: toProfile(data),
})
