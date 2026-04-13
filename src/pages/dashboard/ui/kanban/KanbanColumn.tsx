import { memo, useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import invariant from 'tiny-invariant'
import { TSolution, TStatusId, TStatusName } from '@/shared/model'
import { KanbanCard } from './KanbanCard'
import styles from '../styles.module.scss'

interface IKanbanColumnProps {
  id: TStatusId
  title: TStatusName
  cards: TSolution[]
}

export const KanbanColumn = memo(({ id, title, cards }: IKanbanColumnProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return dropTargetForElements({
      element: el,
      getData: () => ({ type: 'kanban-column', columnId: id }),
      canDrop: ({ source }) =>
        source.data.type === 'kanban-card' && source.data.columnId !== id,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    })
  }, [id])

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>{title}</span>
        <span className={styles.columnCount}>{cards.length}</span>
      </div>
      <div
        ref={ref}
        className={`${styles.columnBody} ${isDraggedOver ? styles.columnBodyOver : ''}`}
      >
        {cards.map((solution) => (
          <KanbanCard key={solution.id} solution={solution} columnId={id} />
        ))}
        {cards.length === 0 && <p className={styles.columnEmpty}>Нет задач</p>}
      </div>
    </div>
  )
})

KanbanColumn.displayName = 'KanbanColumn'
