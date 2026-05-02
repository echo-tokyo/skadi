import { GRADE_OPTIONS } from '@/shared/config'
import { z } from 'zod'

export const VALID_STATUSES = [1, 2, 3, 4] as const

const GRADE_VALUES = GRADE_OPTIONS.map((o) => o.value)

export const solutionTeacherSchema = z.object({
  status: z.literal(VALID_STATUSES, 'Обязательное поле'),
  grade: z.enum(GRADE_VALUES).or(z.literal('')),
})
export const solutionStudentSchema = z.object({
  status: z.literal(VALID_STATUSES, 'Обязательное поле'),
  answer: z.string(),
  file_answer: z.array(z.file()),
  deleted_file_ids: z.array(z.number()),
})

export type TSolutionTeacherSchema = z.infer<typeof solutionTeacherSchema>
export type TSolutionStudentSchema = z.infer<typeof solutionStudentSchema>
export type TSolutionBaseSchema = Pick<TSolutionTeacherSchema, 'status'>
