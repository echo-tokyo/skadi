import { IClass } from '@/entities/class'
import { AccordionCard } from '@/shared/ui'
import { memo } from 'react'
import styles from './styles.module.scss'
import { DeleteClassButton } from '@/features/delete-class'
import { EditClassButton } from '@/features/edit-class'

interface IClassCardItemProps {
  classData: IClass
}

export const ClassCardItem = memo(({ classData }: IClassCardItemProps) => {
  return (
    <AccordionCard
      title={classData.name}
      fields={[
        { label: 'Преподаватель', value: classData.teacher?.fullname },
        {
          label: 'Студенты',
          value: classData.students?.map((el) => el.fullname).join(', '),
        },
        { label: 'Расписание', value: classData.schedule },
      ]}
      actions={
        <div className={styles.actions}>
          <DeleteClassButton id={classData.id} name={classData.name} />
          <EditClassButton classData={classData} />
        </div>
      }
    />
  )
})

ClassCardItem.displayName = 'ClassCardItem'
