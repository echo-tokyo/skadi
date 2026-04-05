import {
  IUpdateMemberRequest,
  TMemberFullSchema,
  toProfile,
} from '@/entities/member'

export const transformToUpdateRequest = (
  data: TMemberFullSchema,
): IUpdateMemberRequest => ({
  class_id: Number(data.class),
  profile: toProfile(data),
})
