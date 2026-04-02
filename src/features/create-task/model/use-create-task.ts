import { ICreateTaskRequest, useCreateTaskMutation } from '@/entities/task'
import { TTaskSchema } from '@/entities/task/model/schema'
import { useMutationAction } from '@/shared/lib'

const prepare = (data: TTaskSchema): ICreateTaskRequest => ({
  title: data.title,
  description: data.description,
  students: data.students.map(Number),
})

export const useCreateTask = () => {
  return useMutationAction({
    mutation: useCreateTaskMutation(),
    prepare,
    successMessage: 'Задание создано',
  })
}
