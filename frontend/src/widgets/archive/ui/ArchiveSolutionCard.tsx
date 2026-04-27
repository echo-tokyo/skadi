import { TSolution } from '@/shared/model'
import { AccordionCard, Button } from '@/shared/ui'
import { memo } from 'react'
import { useNavigate } from 'react-router'

interface IArchiveSolutionCardProps {
  solutionData: TSolution
}

export const ArchiveSolutionCard = memo(
  ({ solutionData }: IArchiveSolutionCardProps) => {
    const nav = useNavigate()

    return (
      <AccordionCard
        title={solutionData.task.title}
        fields={[
          { label: 'Статус', value: solutionData.status.name },
          { label: 'Оценка', value: solutionData.grade ?? '-' },
        ]}
        actions={
          <Button
            color='secondary'
            onClick={() => nav(`/personal-area/solutions/${solutionData.id}`)}
          >
            Просмотреть
          </Button>
        }
      />
    )
  },
)

ArchiveSolutionCard.displayName = 'ArchiveSolutionCard'
