import { TDisplayValues } from '../../model/types'
import TaskAnswerTeacher from './TaskAnswerTeacher'
import TaskAnswerStudent from './TaskAnswerStudent'

interface ITaskAnswerProps {
  displayValues: TDisplayValues
  actualSchema: 'teacherSchema' | 'studentSchema'
}

const TaskAnswer = ({ displayValues, actualSchema }: ITaskAnswerProps) => {
  if (actualSchema === 'teacherSchema') {
    return <TaskAnswerTeacher displayValues={displayValues} />
  }
  return <TaskAnswerStudent />
}

export default TaskAnswer
