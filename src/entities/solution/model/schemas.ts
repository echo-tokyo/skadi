import { z } from 'zod'

export const solutionTeacherSchema = z.object({
  status: z.enum(['3', '4'], 'Обязательное поле'),
})
export const solutionStudentSchema = z.object({
  status: z.enum(['1', '2', '3'], 'Обязательное поле'),
  answer: z.string(),
})

export type TSolutionTeacherSchema = z.infer<typeof solutionTeacherSchema>
export type TSolutionStudentSchema = z.infer<typeof solutionStudentSchema>
