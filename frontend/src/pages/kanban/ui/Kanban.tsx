import { FC } from 'react'
import { KanbanBoard } from './kanban/KanbanBoard'
import { PlugDefault, Skeleton } from '@/shared/ui'
import { useGetSolutions } from '../model/use-get-solutions'
import styles from './styles.module.scss'

const Kanban: FC = () => {
  const { solutions, isLoading } = useGetSolutions()

  if (isLoading) {
    return <Skeleton height={'100%'} />
  }

  if (solutions.length === 0) {
    return <PlugDefault />
  }

  return (
    <div className={styles.wrapper}>
      <KanbanBoard solutions={solutions} />
    </div>
  )
}

export default Kanban
