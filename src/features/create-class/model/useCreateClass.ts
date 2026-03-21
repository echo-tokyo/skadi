import { useCreateClassMutation } from '@/entities/class/api/class-api'
import { transformToRequest } from '../lib/transform-to-request'
import { TClassSchema } from '@/entities/class/model/class-form-schema'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'

export const useCreateClass = () => {
  const [createClass, { isLoading }] = useCreateClassMutation()

  const submit = async (formData: TClassSchema) => {
    try {
      await createClass(transformToRequest(formData)).unwrap()
      toast.info('Группа создана')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    }
  }

  return { submit, isLoading }
}
