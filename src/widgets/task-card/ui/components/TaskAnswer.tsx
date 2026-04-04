import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { useFormContext } from 'react-hook-form'
import { TSolutionStudentSchema } from '@/entities/solution'
import { TDisplayValues } from '../../model/types'

interface ITaskAnswerSectionProps {
  displayValues: TDisplayValues
  actualSchema: 'teacherSchema' | 'studentSchema'
}

// FIXME: разбить taskAnswer для препода и студента. watch вызывается в любом случае
const TaskAnswer = (props: ITaskAnswerSectionProps) => {
  const { displayValues, actualSchema } = props

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TSolutionStudentSchema>()

  const answerValue = watch('answer')

  return (
    <div className={styles.card}>
      <Text size='20' weight='bold'>
        Ответ
      </Text>
      <div className={styles.cardFields}>
        {actualSchema === 'studentSchema' ? (
          <Textarea
            label='Письменный ответ'
            fluid
            value={answerValue}
            isValid={!errors['answer']}
            description={errors.answer?.message}
            onChange={(val) => setValue('answer', val)}
          />
        ) : (
          <Textarea
            label='Письменный ответ'
            placeholder='Письменного ответа нет'
            fluid
            disabled
            value={displayValues.answer}
            onChange={() => undefined}
          />
        )}
      </div>
    </div>
  )
}

export default TaskAnswer
