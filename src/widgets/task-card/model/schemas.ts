import { z } from 'zod'

export const taskSchema = z.object({
  students: z.array(z.string()),
  description: z.string().min(1, 'Обязательное поле'),
  title: z.string().min(1, 'Обязательное поле'),
})

export const solutionTeacherSchema = z.object({
  // TODO: добавить grade
  anser: z.string(),
  status: z.string(),
})

// export const taskFullSchema = z.object({
//   ...taskSchema.shape,
//   status: z.string(),
// })

export type TTaskSchema = z.infer<typeof taskSchema>
export type TSolutionTeacherSchema = z.infer<typeof solutionTeacherSchema>
// export type TTaskFullSchema = z.infer<typeof taskFullSchema>
