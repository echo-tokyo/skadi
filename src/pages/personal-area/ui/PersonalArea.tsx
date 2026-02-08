import { FC, ReactNode } from 'react'
import styles from './styles.module.scss'

const PersonalArea: FC = (): ReactNode => {
  // const userData = useAppSelector((state) => state.user)
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}></div>
      <div className={styles.right}></div>
    </div>
  )
}

export default PersonalArea
