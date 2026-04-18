import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { TDisplayValues } from '../../model/types'

interface ITaskAnswerTeacherProps {
  displayValues: TDisplayValues
}

const TaskAnswerTeacher = ({ displayValues }: ITaskAnswerTeacherProps) => {
  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Ответ
      </Text>
      <div className={styles.cardFields}>
        <Textarea
          label='Письменный ответ'
          placeholder='Письменного ответа нет'
          fluid
          disabled
          value={displayValues.answer}
          onChange={() => undefined}
        />
      </div>
    </div>
  )
}

export default TaskAnswerTeacher
