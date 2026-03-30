import { z } from 'zod'

export const taskCreateSchema = z.object({
  teacher: z.string(),
  students: z.array(z.string()),
  description: z.string().min(1, 'Обязательное поле'),
  title: z.string().min(1, 'Обязательное поле'),
})

export const taskFullSchema = z.object({
  ...taskCreateSchema.shape,
  status: z.string(),
})

export type TTaskCreateSchema = z.infer<typeof taskCreateSchema>
export type TTaskFullSchema = z.infer<typeof taskFullSchema>
