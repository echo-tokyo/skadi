import { TProfile, TSolution } from '@/shared/model'

export interface IGetSolutionByIdResponse {
  other_students: TProfile[]
  solution: TSolution
}
