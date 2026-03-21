import { TClassSchema } from '@/entities/class/model/class-form-schema'
import { ICreateClassRequest } from '@/entities/class/model/types'

export const transformToRequest = (
  data: TClassSchema,
): ICreateClassRequest => ({
  name: data.className,
  schedule: data.schedule,
  students: data.students.map((el) => Number(el)),
  teacherId: Number(data.teacher),
})
