import { Comment, MessageInput, Text } from '@/shared/ui'
import styles from './styles.module.scss'

const Comments = () => {
  return (
    <div className={styles.comments}>
      <Text size='20' weight='600'>
        Комментарии
      </Text>
      <div className={styles.commentsContent}>
        <Comment message='d' time='dw' sender='dwdw' align='left' />
      </div>
      <MessageInput onSubmit={(v) => console.log(v)} />
    </div>
  )
}

export default Comments
