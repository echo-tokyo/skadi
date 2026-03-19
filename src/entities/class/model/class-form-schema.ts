import { z } from 'zod'

export const classSchema = z.object({
  className: z
    .string()
    .min(1, 'Обязательное поле')
    .max(50, 'Максимум 50 символов'),
  teacher: z.string(),
  students: z.string(),
  schedule: z.string().max(100, 'Максимум 100 символов'),
})

export type TClassSchema = z.infer<typeof classSchema>
