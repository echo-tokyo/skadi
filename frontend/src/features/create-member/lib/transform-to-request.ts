import {
  ICreateMemberRequest,
  TMemberFullSchema,
  toProfile,
} from '@/entities/member'

export const transformToRequest = (
  data: TMemberFullSchema,
): ICreateMemberRequest => ({
  class_id: Number(data.class),
  username: data.username,
  password: data.password,
  role: data.role,
  profile: toProfile(data),
})
