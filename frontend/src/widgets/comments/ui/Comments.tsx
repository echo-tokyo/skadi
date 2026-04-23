import {
  Comment,
  MessageInput,
  PlugDefault,
  Sentinel,
  Skeleton,
  Text,
} from '@/shared/ui'
import { unixToDate, useInfiniteScroll, useShowSkeleton } from '@/shared/lib'
import styles from './styles.module.scss'
import { useGetComments } from '../model/use-get-comments'
import { useSendComment } from '../model/use-send-comment'
import { TRole } from '@/shared/model'

interface ICommentsProps {
  role: TRole
  solutionId: number
}

const Comments = (props: ICommentsProps) => {
  const { role, solutionId } = props
  const { messages, hasMore, isFetchingNextPage, loadMore, isLoading } =
    useGetComments({
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
        {messages.map((msg) => {
          const align = msg.role === role ? 'right' : 'left'
          return (
            <Comment
              key={msg.id}
              message={msg.message}
              time={unixToDate(msg.created_at)}
              sender={msg.role}
              align={align}
            />
          )
        })}
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
