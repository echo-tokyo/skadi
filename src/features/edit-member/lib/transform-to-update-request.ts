import { IUpdateMemberRequest, TMemberFullSchema, toProfile } from '@/entities/member'

export const transformToUpdateRequest = (
  data: TMemberFullSchema,
): IUpdateMemberRequest => ({
  // TODO: добавить классы, как появятся
  classId: undefined,
  profile: toProfile(data),
})
