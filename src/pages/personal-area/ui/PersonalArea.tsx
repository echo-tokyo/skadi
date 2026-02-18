import { FC, ReactNode, useState } from 'react'
import styles from './styles.module.scss'
import { Text } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks'
import { ITabConfig, TAB_CONFIG } from '../model/tabs'
import { selectAuthenticatedUser } from '@/entities/user'

const PersonalArea: FC = (): ReactNode => {
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role
  const tabs = TAB_CONFIG.filter((tab) => tab.role === role)
  const [currentTab, setCurrentTab] = useState<ITabConfig>(tabs[0])

  const tabClick = (tab: ITabConfig): void => {
    setCurrentTab(tab)
  }

  const ActiveComponent = currentTab.component

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Text weight='bold' size='20'>
          Test
        </Text>
        {tabs.map((tab) => (
          <p onClick={() => tabClick(tab)} key={tab.name}>
            {tab.name}
          </p>
        ))}
      </div>
      <div className={styles.right}>
        <ActiveComponent />
      </div>
    </div>
  )
}

export default PersonalArea
