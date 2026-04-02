import { TTask } from '@/shared/model'
import { TTaskSchema } from '@/entities/task/model/schema'

export const toFormData = (task: TTask): TTaskSchema => ({
  title: task.title,
  description: task.description ?? '',
  students: [],
})
