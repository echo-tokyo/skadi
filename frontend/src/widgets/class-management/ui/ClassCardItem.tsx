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
        { label: 'Расписание', value: classData.schedule },
        { label: 'Студентов', value: classData.students?.length },
        { label: 'Преподаватель', value: classData.teacher?.fullname },
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
