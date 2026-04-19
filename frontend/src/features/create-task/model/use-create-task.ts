import {
  ICreateTaskRequest,
  TTaskSchema,
  useCreateTaskMutation,
} from '@/entities/task'
import { useMutationAction } from '@/shared/lib'

const prepare = (data: TTaskSchema): ICreateTaskRequest => ({
  title: data.title,
  description: data.description,
  students: data.students.map(Number),
  classes: data.classes.map(Number),
})

export const useCreateTask = () => {
  return useMutationAction({
    mutation: useCreateTaskMutation(),
    prepare,
    successMessage: 'Задание создано',
  })
}
