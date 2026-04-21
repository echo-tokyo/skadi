import z from 'zod'

export const taskSchemaUpdate = z
  .object({
    title: z.string().min(1, 'Обязательное поле'),
    description: z.string().min(1, 'Обязательное поле'),
    students: z.array(z.string()),
    file: z.array(z.file()),
  })
  .describe('taskSchemaUpdate')

export const taskSchemaCreate = z
  .object({
    ...taskSchemaUpdate.shape,
    classes: z.array(z.string()),
  })
  .describe('taskSchemaCreate')

export type TTaskSchemaCreate = z.infer<typeof taskSchemaCreate>
export type TTaskSchemaUpdate = z.infer<typeof taskSchemaUpdate>
