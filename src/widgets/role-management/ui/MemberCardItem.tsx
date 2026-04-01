import { IMember } from '@/entities/member'
import { AccordionCard } from '@/shared/ui'
import { DeleteMemberButton } from '@/features/delete-member'
import { EditMemberButton } from '@/features/edit-member'
import { memo } from 'react'
import styles from './styles.module.scss'

export const MemberCardItem = memo(({ member }: { member: IMember }) => {
  return (
    <AccordionCard
      title={member.profile.fullname}
      fields={[
        { label: 'Статус', value: member.role },
        { label: 'Группа', value: member.class?.name },
      ]}
      actions={
        <div className={styles.cardActions}>
          <DeleteMemberButton
            fullname={member.profile.fullname}
            id={member.id}
          />
          <EditMemberButton member={member} />
        </div>
      }
    />
  )
})

MemberCardItem.displayName = 'MemberCardItem'
