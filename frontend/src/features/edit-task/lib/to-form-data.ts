import { TTaskSchema } from '@/entities/task'
import { TTask } from '@/shared/model'

export const toFormData = (task: TTask): TTaskSchema => ({
  title: task.title,
  description: task.description ?? '',
  students: [],
  classes: [],
})
