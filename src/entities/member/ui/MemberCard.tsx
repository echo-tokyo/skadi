import { Divider, Text } from '@/shared/ui'
import Accordion from '@/shared/ui/accordion/Accordion'
import { ReactNode } from 'react'
import styles from './styles.module.scss'

// FIXME: fullname и role не должны быть undefined
interface IMemberCardProps {
  fullname?: string
  role?: string
  group?: string
  actions?: ReactNode
}

type TAccordionContentProps = Omit<IMemberCardProps, 'fullname'>

const AccordionContent = (props: TAccordionContentProps): ReactNode => {
  const { role, group, actions } = props
  return (
    <div className={styles.content}>
      <div className={styles.contentItem}>
        <Text>{`Статус: ${role ? role : ''}`}</Text>
        <Divider />
      </div>
      <div className={styles.contentItem}>
        <Text>{`Группа: ${group ? group : ''}`}</Text>
      </div>
      {actions}
    </div>
  )
}

const MemberCard = (props: IMemberCardProps) => {
  const { fullname, ...contentProps } = props
  return (
    <>
      <Accordion
        label={fullname ? fullname : '-'}
        content={<AccordionContent {...contentProps} />}
      />
    </>
  )
}

export default MemberCard
