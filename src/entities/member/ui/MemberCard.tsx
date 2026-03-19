import { Accordion, Divider, Text } from '@/shared/ui'
import { ReactNode } from 'react'
import styles from './styles.module.scss'

// FIXME: fullname и memberRole не должны быть undefined. как бэк обновится - обновить в остальных местах
interface IMemberCardProps {
  fullname?: string
  memberRole?: string
  group?: string
  actions?: ReactNode
}

type TAccordionContentProps = Omit<IMemberCardProps, 'fullname'>

const AccordionContent = (props: TAccordionContentProps): ReactNode => {
  const { memberRole, group, actions } = props
  return (
    <div className={styles.content}>
      <div>
        <Text size='14'>{`Статус: ${memberRole ?? '-'}`}</Text>
        <Divider />
      </div>
      <div>
        <Text size='14'>{`Группа: ${group ?? '-'}`}</Text>
        <Divider />
      </div>
      {actions}
    </div>
  )
}

const MemberCard = (props: IMemberCardProps) => {
  const { fullname, ...contentProps } = props
  return (
    <Accordion
      label={fullname ?? '-'}
      content={<AccordionContent {...contentProps} />}
    />
  )
}

AccordionContent.displayName = 'AccordionContent'
export default MemberCard
