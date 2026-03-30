import { TTaskCreateSchema } from '../model/schemas'

export const initialFormValues: TTaskCreateSchema = {
  description: '',
  students: [],
  teacher: 'Вы',
  title: '',
  // status: '',
}
