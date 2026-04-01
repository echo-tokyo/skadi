import { TTaskSchema } from '@/widgets/task-card/model/schemas'

export const mockTaskData = {
  description: 'fefe',
  id: 5,
  title: 'Моковое задание',
  teacher: {
    id: 5,
    fullname: 'Моковой препод',
  },
  students: ['75'],
}

export const toFieldTaskData: TTaskSchema = {
  description: mockTaskData.description ?? '',
  title: mockTaskData.title,
  students: mockTaskData.students,
}
