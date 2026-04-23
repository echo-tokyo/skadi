import {
  Comment,
  MessageInput,
  PlugDefault,
  Sentinel,
  Skeleton,
  Text,
} from '@/shared/ui'
import { useInfiniteScroll, useShowSkeleton } from '@/shared/lib'
import styles from './styles.module.scss'
import { useGetComments } from '../model/use-get-comments'
import { useSendComment } from '../model/use-send-comment'

interface ICommentsProps {
  solutionId: number
}

const Comments = ({ solutionId }: ICommentsProps) => {
  const { hasMore, isFetchingNextPage, loadMore, isLoading } = useGetComments({
    id: solutionId,
  })

  const { submit, isLoading: isSending } = useSendComment({ id: solutionId })

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isFetchingNextPage,
    loadMore,
  })

  const showSkeleton = useShowSkeleton(isLoading)

  const renderContent = () => {
    if (showSkeleton) {
      return <Skeleton height={'100%'} />
    }

    const hasComments = true

    if (!hasComments) {
      return <PlugDefault />
    }

    return (
      <>
        <Comment message='d' time='dw' sender='dwdw' align='left' />
        <Sentinel ref={sentinelRef} />
      </>
    )
  }

  return (
    <div className={styles.comments}>
      <Text size='20' weight='600'>
        Комментарии
      </Text>
      <div className={styles.commentsContent}>{renderContent()}</div>
      <MessageInput onSubmit={submit} disabled={isSending} />
    </div>
  )
}

export default Comments
