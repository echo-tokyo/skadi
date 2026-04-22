import { Text, Textarea } from '@/shared/ui'
import styles from '../styles.module.scss'
import { TDisplayValues } from '../../model/types'
import { FileDownload } from '@/features/file-download'

interface ITaskAnswerTeacherProps {
  displayValues: TDisplayValues
}

const TaskAnswerTeacher = ({ displayValues }: ITaskAnswerTeacherProps) => {
  return (
    <div className={styles.card}>
      <Text size='20' weight='600'>
        Ответ
      </Text>
      <div className={styles.cardAnswerFields}>
        <Textarea
          label='Письменный ответ'
          placeholder='Письменного ответа нет'
          fluid
          disabled
          value={displayValues.answer}
          onChange={() => undefined}
        />
        <div className={styles.cardAnswerFiles}>
          {displayValues.file_answer.length > 0 &&
            displayValues.file_answer.map((el) => (
              <FileDownload key={el.id} el={el} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default TaskAnswerTeacher
