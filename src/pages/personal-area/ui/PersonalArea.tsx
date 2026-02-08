import { FC, ReactNode } from 'react'
import styles from './styles.module.scss'
import { Text } from '@/shared/ui'

const PersonalArea: FC = (): ReactNode => {
  // const userData = useAppSelector((state) => state.user)
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Text weight='bold' size='20'>
          Test
        </Text>
      </div>
      <div className={styles.right}></div>
    </div>
  )
}

export default PersonalArea
