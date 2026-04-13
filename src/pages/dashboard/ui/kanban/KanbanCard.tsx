import { memo, useEffect, useRef, useState } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import invariant from 'tiny-invariant'
import { TSolution, TStatusId } from '@/shared/model'
import styles from '../styles.module.scss'

interface IKanbanCardProps {
  solution: TSolution
  columnId: TStatusId
}

export const KanbanCard = memo(({ solution, columnId }: IKanbanCardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return draggable({
      element: el,
      getInitialData: () => ({
        type: 'kanban-card',
        cardId: solution.id,
        columnId,
      }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    })
  }, [solution.id, columnId])

  return (
    <div
      ref={ref}
      className={styles.card}
      style={{ opacity: dragging ? 0.4 : 1 }}
    >
      <p className={styles.cardTitle}>{solution.task.title}</p>
      {solution.task.description && (
        <p className={styles.cardDescription}>{solution.task.description}</p>
      )}
    </div>
  )
})

KanbanCard.displayName = 'KanbanCard'
