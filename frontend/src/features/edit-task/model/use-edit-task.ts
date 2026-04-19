import {
  IUpdateTaskRequest,
  TTaskSchema,
  useUpdateTaskMutation,
} from '@/entities/task'
import { useMutationAction } from '@/shared/lib'

const prepare =
  (id: number) =>
  (data: TTaskSchema): IUpdateTaskRequest => ({
    id,
    title: data.title,
    description: data.description,
    students: data.students.map(Number),
    classes: data.classes.map(Number),
  })

export const useEditTask = (id: number) => {
  return useMutationAction({
    mutation: useUpdateTaskMutation(),
    prepare: prepare(id),
    successMessage: 'Задание обновлено',
  })
}
