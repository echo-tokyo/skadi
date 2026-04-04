import UpdateSolutionByStudentButton from './components/UpdateSolutionByStudentButton'
import UpdateSolutionByTeacherButton from './components/UpdateSolutionByTeacherButton'

interface IUpdateSolutionButtonProps {
  id: number
  actualSchema: 'teacherSchema' | 'studentSchema'
}

const UpdateSolutionButton = (props: IUpdateSolutionButtonProps) => {
  const { id, actualSchema } = props

  return actualSchema === 'teacherSchema' ? (
    <UpdateSolutionByTeacherButton id={id} />
  ) : (
    <UpdateSolutionByStudentButton id={id} />
  )
}

export default UpdateSolutionButton
