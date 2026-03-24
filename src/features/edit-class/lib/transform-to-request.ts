import { IClassRequest, TClassSchema } from '@/entities/class'

export const transformToRequest = (data: TClassSchema): IClassRequest => ({
  name: data.className,
  schedule: data.schedule,
  students: data.students.map((el) => Number(el)),
  teacher_id: Number(data.teacher),
})
