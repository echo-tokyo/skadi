import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { Controller, useFormContext } from 'react-hook-form'
import { TSolutionStudentSchema } from '@/entities/solution'

const TaskAnswerStudent = () => {
  const { control } = useFormContext<TSolutionStudentSchema>()

  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Ответ
      </Text>
      <div className={styles.cardFields}>
        <Controller
          control={control}
          name='answer'
          render={({ field, fieldState }) => (
            <Textarea
              label='Письменный ответ'
              fluid
              value={field.value}
              isValid={!fieldState.error}
              description={fieldState.error?.message}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  )
}

export default TaskAnswerStudent
