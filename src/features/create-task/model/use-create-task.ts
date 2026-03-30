import { ICreateTaskRequest, useCreateTaskMutation } from '@/entities/task'
import { useMutationAction } from '@/shared/lib'
import { TTaskCreateSchema } from '@/widgets/task-card'

const prepare = (data: TTaskCreateSchema): ICreateTaskRequest => ({
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
