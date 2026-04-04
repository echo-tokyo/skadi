import { z } from 'zod'

export const TEACHER_VALID_STATUSES = ['3', '4'] as const
export const STUDENT_VALID_STATUSES = ['1', '2', '3'] as const

export const solutionTeacherSchema = z.object({
  status: z.enum(TEACHER_VALID_STATUSES, 'Обязательное поле'),
})
export const solutionStudentSchema = z.object({
  status: z.enum(STUDENT_VALID_STATUSES, 'Обязательное поле'),
  answer: z.string(),
})

export type TSolutionTeacherSchema = z.infer<typeof solutionTeacherSchema>
export type TSolutionStudentSchema = z.infer<typeof solutionStudentSchema>
