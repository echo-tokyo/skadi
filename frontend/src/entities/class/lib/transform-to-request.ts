import { TClassSchema } from '../model/class-form-schema'
import { IClassRequest } from '../model/types'

export const transformToRequest = (data: TClassSchema): IClassRequest => ({
  name: data.className,
  schedule: data.schedule,
  students: data.students.map((el) => Number(el)),
  teacher_id: Number(data.teacher),
})
