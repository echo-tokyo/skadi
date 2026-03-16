import { z } from 'zod'
import { ROLES } from '../config/role-options'

const phoneSchema = z
  .string()
  .regex(/^\+?[0-9\s\-()]{11,20}$/, 'Некорректный номер телефона')
  .or(z.literal(''))

export const memberBaseSchema = z.object({
  fullname: z
    .string()
    .min(1, 'Обязательное поле')
    .max(150, 'Максимум 150 символов'),
  address: z.string().max(200, 'Максимум 200 символов'),
  email: z.email('Некорректный email').or(z.literal('')),
  phone: phoneSchema,
  parentEmail: z.email('Некорректный email').or(z.literal('')),
  parentPhone: phoneSchema,
  extra: z.string().max(500, 'Максимум 500 символов'),
})

const memberIdentitySchema = z.object({
  role: z.enum(ROLES, { message: 'Выберите роль' }),
  username: z
    .string()
    .min(1, 'Обязательное поле')
    .min(3, 'Минимум 3 символа')
    .max(50, 'Максимум 50 символов')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Только латиница, цифры, _ и -'),
  password: z
    .string()
    .min(1, 'Обязательное поле')
    .min(8, 'Минимум 8 символов')
    .max(40, 'Максимум 40 символов'),
})

export const memberFullSchema = z.object({
  ...memberBaseSchema.shape,
  ...memberIdentitySchema.shape,
})
export type TMemberBaseSchema = z.infer<typeof memberBaseSchema>
export type TMemberFullSchema = z.infer<typeof memberFullSchema>
