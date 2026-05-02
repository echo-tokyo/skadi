import { z } from 'zod'

export const TEACHER_VALID_STATUSES = [1, 2, 3, 4] as const
export const STUDENT_VALID_STATUSES = [1, 2, 3, 4] as const

// FIXME: Взять из GRADE_OPTIONS
export const GRADE = ['2', '3', '4', '5'] as const

export const solutionTeacherSchema = z.object({
  status: z.literal(TEACHER_VALID_STATUSES, 'Обязательное поле'),
  grade: z.literal(GRADE, 'Неправильное значение').or(z.string()),
})
export const solutionStudentSchema = z.object({
  status: z.literal(STUDENT_VALID_STATUSES, 'Обязательное поле'),
  answer: z.string(),
  file_answer: z.array(z.file()),
  deleted_file_ids: z.array(z.number()),
})

export type TSolutionTeacherSchema = z.infer<typeof solutionTeacherSchema>
export type TSolutionStudentSchema = z.infer<typeof solutionStudentSchema>
