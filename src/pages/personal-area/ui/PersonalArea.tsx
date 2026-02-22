import { FC, ReactNode, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { Text } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks'
import { ITabConfig, TAB_CONFIG } from '../model/tabs'
import { selectAuthenticatedUser } from '@/entities/user'

const PersonalArea: FC = (): ReactNode => {
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role

  const tabs = useMemo(
    () => TAB_CONFIG.filter((tab) => tab.role === role),
    [role],
  )

  const [currentTab, setCurrentTab] = useState<ITabConfig | null>(
    tabs[0] ?? null,
  )

  const ActiveComponent = currentTab?.component

  const getTabColor = (
    tab: ITabConfig,
  ): '--color-primary' | undefined =>
    currentTab?.name === tab.name ? '--color-primary' : undefined

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Text weight='bold' size='20'>
          Личный кабинет
        </Text>
        {tabs.map((tab) => (
          <button
            type='button'
            className=''
            onClick={() => setCurrentTab(tab)}
            key={tab.name}
          >
            <Text color={getTabColor(tab)}>{tab.name}</Text>
          </button>
        ))}
      </div>
      <div className={styles.right}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}

export default PersonalArea
