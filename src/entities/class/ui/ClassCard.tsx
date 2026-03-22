import { Accordion, Divider, Text } from '@/shared/ui'
import { ReactNode } from 'react'
import styles from './styles.module.scss'

interface IClassCardProps {
  name: string
  schedule?: string
  studentsCount?: number
  teacherName?: string
  actions?: ReactNode
}

type TAccordionContentProps = Omit<IClassCardProps, 'name'>

const AccordionContent = (props: TAccordionContentProps): ReactNode => {
  const { schedule, studentsCount, teacherName, actions } = props
  return (
    <div className={styles.content}>
      <div>
        <Text size='14'>{`Расписание: ${schedule ?? '-'}`}</Text>
        <Divider />
      </div>
      <div>
        <Text size='14'>{`Студентов: ${studentsCount ?? '-'}`}</Text>
        <Divider />
      </div>
      <div>
        <Text size='14'>{`Преподаватель: ${teacherName ?? '-'}`}</Text>
        <Divider />
      </div>
      {actions}
    </div>
  )
}

const ClassCard = (props: IClassCardProps) => {
  const { name, ...contentProps } = props
  return (
    <Accordion label={name} content={<AccordionContent {...contentProps} />} />
  )
}

AccordionContent.displayName = 'AccordionContent'
export default ClassCard
