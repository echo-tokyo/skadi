import { TSolution } from '@/shared/model'
import { AccordionCard, Button } from '@/shared/ui'
import { memo } from 'react'
import { useNavigate } from 'react-router'
import styles from './styles.module.scss'

interface ISolutionCardItemProps {
  solutionData: TSolution
}

export const SolutionCardItem = memo(
  ({ solutionData }: ISolutionCardItemProps) => {
    const nav = useNavigate()

    return (
      <AccordionCard
        title={solutionData.student?.fullname ?? 'Нет ученика'}
        fields={[
          { label: 'Задание', value: solutionData.task.title },
          { label: 'Статус', value: solutionData.status.name },
        ]}
        actions={
          <div className={styles.cardActions}>
            <Button
              color='secondary'
              onClick={() => nav(`/personal-area/solutions/${solutionData.id}`)}
            >
              Просмотреть
            </Button>
          </div>
        }
      />
    )
  },
)

SolutionCardItem.displayName = 'SolutionCardItem'
