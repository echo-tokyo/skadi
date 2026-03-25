import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api'
import {
  TClassSchema,
  transformToRequest,
  useCreateClassMutation,
} from '@/entities/class'

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
