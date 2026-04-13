import { useEffect, useMemo, useState } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useStudentUpdateSolutionStatus } from '@/features/update-solution'
import { TSolution, TStatusId } from '@/shared/model'
import { KANBAN_COLUMNS, KanbanColumnConfig } from '../../config/columns'
import { KanbanColumn } from './KanbanColumn'
import styles from '../styles.module.scss'

const COLUMN_MAP = Object.fromEntries(
  KANBAN_COLUMNS.map((c) => [c.id, c]),
) as Record<TStatusId, KanbanColumnConfig>

interface IKanbanBoardProps {
  initialSolutions: TSolution[]
}

export const KanbanBoard = ({ initialSolutions }: IKanbanBoardProps) => {
  const [solutions, setSolutions] = useState<TSolution[]>(initialSolutions)
  const { submit: updateStatus } = useStudentUpdateSolutionStatus()

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.type === 'kanban-card',
      onDrop({ source, location }) {
        const dropTarget = location.current.dropTargets[0]
        if (!dropTarget) return

        const cardId = source.data.cardId as number
        const newColumnId = dropTarget.data.columnId as TStatusId
        const column = COLUMN_MAP[newColumnId]
        if (!column) return

        let snapshot: TSolution[] = []

        setSolutions((prev) => {
          snapshot = prev
          return prev.map((s) =>
            s.id === cardId
              ? {
                  ...s,
                  status: { ...s.status, id: newColumnId, name: column.title },
                }
              : s,
          )
        })

        updateStatus({ id: cardId, status_id: newColumnId }).then((success) => {
          if (!success) setSolutions(snapshot)
        })
      },
    })
  }, [])

  const solutionsByColumn = useMemo(
    () =>
      solutions.reduce<Partial<Record<TStatusId, TSolution[]>>>((acc, s) => {
        const id = s.status.id
        if (!id) return acc
        if (!acc[id]) acc[id] = []
        acc[id]!.push(s)
        return acc
      }, {}),
    [solutions],
  )

  return (
    <div className={styles.board}>
      {KANBAN_COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          id={col.id}
          title={col.title}
          cards={solutionsByColumn[col.id] ?? []}
        />
      ))}
    </div>
  )
}
