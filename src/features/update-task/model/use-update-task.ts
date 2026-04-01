import { IUpdateTaskRequest, useUpdateTaskMutation } from '@/entities/task'
import { useMutationAction } from '@/shared/lib'
import { TTaskSchema } from '@/widgets/task-card'

const prepare = (id: number) =>
  (data: TTaskSchema): IUpdateTaskRequest => ({
    id,
    title: data.title,
    description: data.description,
    students: data.students.map(Number),
  })

export const useUpdateTask = (id: number) => {
  return useMutationAction({
    mutation: useUpdateTaskMutation(),
    prepare: prepare(id),
    successMessage: 'Задание обновлено',
  })
}
