import { Input } from '@/shared/ui'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import { TClassSchema } from '../model/class-form-schema'
import { INITIAL_FORM_DATA } from '../config/form-config'
import { zodResolver } from '@hookform/resolvers/zod'
import { classSchema } from '../model/class-form-schema'

interface IClassFormProps {
  fieldData?: TClassSchema
}

const ClassForm = (props: IClassFormProps) => {
  const { fieldData = INITIAL_FORM_DATA } = props
  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm<TClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: fieldData,
  })

  const formData = watch()

  return (
    <div className={styles.wrapper}>
      <Input
        fluid
        title='Название группы'
        isValid={!errors['className']}
        description={errors['className']?.message}
        value={formData['className']}
        onChange={(val) =>
          setValue('className', val, {
            shouldValidate: true,
          })
        }
      />
    </div>
  )
}

export default ClassForm
