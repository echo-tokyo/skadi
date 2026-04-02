import { z } from 'zod'

export const taskSchema = z.object({
  student: z.string(),
  description: z.string().min(1, 'Обязательное поле'),
  title: z.string().min(1, 'Обязательное поле'),
})

export const solutionTeacherSchema = z.object({
  // TODO: добавить grade
  answer: z.string(),
  status: z.enum(['Бэклог', 'В работе', 'На проверке', 'Проверено', '']),
})

export const taskFullSchema = z.object({
  ...taskSchema.shape,
  ...solutionTeacherSchema.shape,
})

export type TTaskSchema = z.infer<typeof taskSchema>
export type TSolutionTeacherSchema = z.infer<typeof solutionTeacherSchema>
export type TTaskFullSchema = z.infer<typeof taskFullSchema>
