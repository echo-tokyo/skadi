import { IClass } from '@/entities/class'
import { TClassSchema } from '@/entities/class/model/class-form-schema'

export const toFieldValues = (classData: IClass): TClassSchema => ({
  className: classData.name,
  schedule: classData.schedule ?? '',
  students: classData.students?.map((el) => String(el.id)) ?? [''],
  teacher: String(classData.teacher?.id),
})
