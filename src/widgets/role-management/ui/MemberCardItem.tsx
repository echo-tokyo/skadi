import { IMember, MemberCard } from '@/entities/member'
import { DeleteMember } from '@/features/delete-member'
import { EditMember } from '@/features/edit-member'
import { memo } from 'react'
import styles from './styles.module.scss'

export const MemberCardItem = memo(({ member }: { member: IMember }) => (
  <MemberCard
    fullname={member.profile?.fullname}
    group={member.profile?.class?.name}
    memberRole={member.role}
    actions={
      <div className={styles.cardActions}>
        <DeleteMember fullname={member.profile?.fullname} id={member.id} />
        <EditMember member={member} />
      </div>
    }
  />
))

MemberCardItem.displayName = 'MemberCardItem'
