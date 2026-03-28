import {
  IUpdateMemberRequest,
  TMemberFullSchema,
  toProfile,
} from '@/entities/member'

export const transformToUpdateRequest = (
  data: TMemberFullSchema,
): IUpdateMemberRequest => ({
  // TODO: добавить классы, как появятся
  class_id: undefined,
  profile: toProfile(data),
})
