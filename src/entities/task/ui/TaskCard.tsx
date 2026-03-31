import { Accordion, Divider, Text } from '@/shared/ui'
import { ReactNode } from 'react'
import styles from './styles.module.scss'

interface ITaskCardProps {
  title: string
  description?: string
  teacherName?: string
  actions?: ReactNode
}

type TAccordionContentProps = Omit<ITaskCardProps, 'title'>

const AccordionContent = (props: TAccordionContentProps): ReactNode => {
  const { description, teacherName, actions } = props
  return (
    <div className={styles.content}>
      <div>
        <Text size='14'>{`Описание: ${description ?? '-'}`}</Text>
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

const TaskCard = (props: ITaskCardProps) => {
  const { title, ...contentProps } = props
  return (
    <Accordion label={title} content={<AccordionContent {...contentProps} />} />
  )
}

AccordionContent.displayName = 'AccordionContent'
export default TaskCard
