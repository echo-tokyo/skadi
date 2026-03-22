import { IClass, ClassCard } from '@/entities/class'
import { Button } from '@/shared/ui'
import { memo } from 'react'
import styles from './styles.module.scss'

interface IClassCardItemProps {
  classData: IClass
}

export const ClassCardItem = memo(({ classData }: IClassCardItemProps) => {
  return (
    <ClassCard
      name={classData.name}
      schedule={classData.schedule}
      studentsCount={classData.students?.length}
      teacherName={classData.teacher?.fullname}
      actions={
        <div className={styles.actions}>
          <Button color='inverted'>Удалить группу</Button>
          <Button color='secondary'>Редактировать группу</Button>
        </div>
      }
    />
  )
})

ClassCardItem.displayName = 'ClassCardItem'
