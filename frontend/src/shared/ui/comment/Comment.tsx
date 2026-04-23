import styles from './styles.module.scss'

interface IProps {
  message: string
  sender: string
  time: string
  align?: 'left' | 'right'
}

const Comment = (props: IProps) => {
  const { message, sender, time, align = 'left' } = props

  return (
    <div className={`${styles.comment} ${styles[align]}`}>
      <span className={styles.sender}>{sender}</span>
      <div className={styles.row}>
        {align === 'right' && <span className={styles.time}>{time}</span>}
        <div className={styles.bubble}>{message}</div>
        {align === 'left' && <span className={styles.time}>{time}</span>}
      </div>
    </div>
  )
}

export default Comment
