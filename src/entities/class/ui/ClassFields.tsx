import { Input, Select } from '@/shared/ui'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import { TClassSchema } from '../model/class-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { classSchema } from '../model/class-form-schema'
import { INITIAL_FIELDS_VALUES } from '../config/fields-config'

interface IClassFieldsProps {
  fieldValues?: TClassSchema
}

const ClassFields = (props: IClassFieldsProps) => {
  const { fieldValues = INITIAL_FIELDS_VALUES } = props
  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm<TClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: fieldValues,
  })

  const fieldsData = watch()

  return (
    <div className={styles.wrapper}>
      <Input
        fluid
        title='Название группы'
        isValid={!errors['className']}
        description={errors['className']?.message}
        value={fieldsData['className']}
        onChange={(val) =>
          setValue('className', val, {
            shouldValidate: true,
          })
        }
      />
      <Select
        fluid
        label='Преподаватель'
        isValid={!errors['className']}
        placeholder='Выберите'
        description={errors['className']?.message}
        options={[
          { value: 'fe', label: 'fe' },
          { label: 'fewq', value: 'kek' },
        ]}
        value={fieldsData['teacher']}
        onChange={(v) =>
          setValue('teacher', v, {
            shouldValidate: true,
          })
        }
      />
    </div>
  )
}

export default ClassFields
