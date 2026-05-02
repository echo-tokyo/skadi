import { GRADE_OPTIONS } from '@/shared/config'
import { TGrade } from '@/shared/model'

export const parseGrade = (raw?: string): TGrade | '' =>
  GRADE_OPTIONS.find((o) => o.value === raw)?.value ?? ''
