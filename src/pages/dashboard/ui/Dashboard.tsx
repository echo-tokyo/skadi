import { FC } from 'react'
import { KanbanBoard } from './kanban/KanbanBoard'
import { Skeleton } from '@/shared/ui'
import { useGetSolutions } from '../model/use-get-solutions'
import styles from './styles.module.scss'

const Dashboard: FC = () => {
  const { solutions, isLoading } = useGetSolutions()

  return (
    <div className={styles.wrapper}>
      {!isLoading ? (
        <KanbanBoard solutions={solutions} />
      ) : (
        <Skeleton height={'100%'} />
      )}
    </div>
  )
}

export default Dashboard
