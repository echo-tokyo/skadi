import { FC } from 'react'
import { KanbanBoard } from './kanban/KanbanBoard'
import { PlugDefault, Skeleton } from '@/shared/ui'
import { useGetSolutions } from '../model/use-get-solutions'
import styles from './styles.module.scss'

const Dashboard: FC = () => {
  const { solutions, isLoading } = useGetSolutions()

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Skeleton height={'100%'} />
      ) : solutions.length === 0 ? (
        <PlugDefault />
      ) : (
        <KanbanBoard solutions={solutions} />
      )}
    </div>
  )
}

export default Dashboard
