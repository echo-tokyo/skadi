import {
  IUpdateTaskRequest,
  TTaskSchemaUpdate,
  useUpdateTaskMutation,
} from '@/entities/task'
import { useMutationAction } from '@/shared/lib'

const prepare =
  (id: number) =>
  (data: TTaskSchemaUpdate): IUpdateTaskRequest => ({
    id,
    title: data.title,
    description: data.description,
    students: data.students.map(Number),
  })

export const useEditTask = (id: number) => {
  return useMutationAction({
    mutation: useUpdateTaskMutation(),
    prepare: prepare(id),
    successMessage: 'Задание обновлено',
  })
}
