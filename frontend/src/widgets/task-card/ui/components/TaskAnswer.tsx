import { TDisplayValues } from '../../model/types'
import TaskAnswerTeacher from './TaskAnswerTeacher'
import TaskAnswerStudent from './TaskAnswerStudent'
import { TFile } from '@/shared/model'

interface ITaskAnswerProps {
  displayValues: TDisplayValues
  actualSchema: 'teacherSchema' | 'studentSchema'
  serverFiles: TFile[]
}

const TaskAnswer = (props: ITaskAnswerProps) => {
  const { actualSchema, displayValues, serverFiles } = props
  if (actualSchema === 'teacherSchema') {
    return <TaskAnswerTeacher displayValues={displayValues} />
  }
  return <TaskAnswerStudent serverFiles={serverFiles} />
}

export default TaskAnswer
