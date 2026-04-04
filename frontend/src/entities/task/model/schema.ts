import z from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Обязательное поле'),
  description: z.string().min(1, 'Обязательное поле'),
  students: z.array(z.string()),
})

export type TTaskSchema = z.infer<typeof taskSchema>
