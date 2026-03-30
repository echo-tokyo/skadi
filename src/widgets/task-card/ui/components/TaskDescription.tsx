import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { useFormContext } from 'react-hook-form'

const TaskDescription = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()
  const fieldsData = watch()

  return (
    <div className={styles.card}>
      <Text size='20' weight='bold'>
        Описание
      </Text>
      <div className={styles.cardFields}>
        <Textarea
          label='Описание задания'
          fluid
          value={fieldsData.description}
          isValid={!errors.description}
          description={errors.description?.message as string}
          onChange={(v) =>
            setValue('description', v, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </div>
    </div>
  )
}

export default TaskDescription
