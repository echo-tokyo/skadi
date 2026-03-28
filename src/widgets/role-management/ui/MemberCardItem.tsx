import { IMember, MemberCard } from '@/entities/member'
import { DeleteMemberButton } from '@/features/delete-member'
import { EditMemberButton } from '@/features/edit-member'
import { memo } from 'react'
import styles from './styles.module.scss'

export const MemberCardItem = memo(({ member }: { member: IMember }) => {
  return (
    <MemberCard
      fullname={member.profile.fullname}
      group={member.class?.name}
      memberRole={member.role}
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
