import { FC } from 'react'
import { KanbanBoard } from './kanban/KanbanBoard'
import { Skeleton } from '@/shared/ui'
import { useGetSolutions } from '../model/use-get-solutions'
import styles from './styles.module.scss'

const Dashboard: FC = () => {
  const { solutions, isLoading } = useGetSolutions()

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Мои задачи</h1>
      {!isLoading ? (
        <KanbanBoard initialSolutions={solutions} />
      ) : (
        <Skeleton height={'100%'} />
      )}
    </div>
  )
}

export default Dashboard
