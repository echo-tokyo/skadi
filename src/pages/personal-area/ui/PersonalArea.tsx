import { FC, ReactNode } from 'react'
import styles from './styles.module.scss'
import { useAppSelector } from '@/shared/lib/hooks'

const PersonalArea: FC = (): ReactNode => {
  const userData = useAppSelector((state) => state.user)

  console.log(userData)
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}></div>
      <div className={styles.right}></div>
    </div>
  )
}

export default PersonalArea
