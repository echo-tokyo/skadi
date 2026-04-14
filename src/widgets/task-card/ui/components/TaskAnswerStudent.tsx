import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { useFormContext } from 'react-hook-form'
import { TSolutionStudentSchema } from '@/entities/solution'

const TaskAnswerStudent = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TSolutionStudentSchema>()

  const answerValue = watch('answer')

  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Ответ
      </Text>
      <div className={styles.cardFields}>
        <Textarea
          label='Письменный ответ'
          fluid
          value={answerValue}
          isValid={!errors['answer']}
          description={errors.answer?.message}
          onChange={(val) =>
            setValue('answer', val, { shouldDirty: true, shouldValidate: true })
          }
        />
      </div>
    </div>
  )
}

export default TaskAnswerStudent
