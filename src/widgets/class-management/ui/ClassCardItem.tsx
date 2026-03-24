import { IClass, ClassCard } from '@/entities/class'
import { memo } from 'react'
import styles from './styles.module.scss'
import { DeleteClassButton } from '@/features/delete-class'
import { EditClassButton } from '@/features/edit-class'

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
          <DeleteClassButton id={classData.id} name={classData.name} />
          <EditClassButton classData={classData} />
        </div>
      }
    />
  )
})

ClassCardItem.displayName = 'ClassCardItem'
