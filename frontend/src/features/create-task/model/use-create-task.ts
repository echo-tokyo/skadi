import {
  ICreateTaskRequest,
  TTaskSchemaCreate,
  useCreateTaskMutation,
} from '@/entities/task'
import { useMutationAction } from '@/shared/lib'

const prepare = (data: TTaskSchemaCreate): ICreateTaskRequest => ({
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
