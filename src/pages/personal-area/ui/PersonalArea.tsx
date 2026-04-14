import { FC, ReactNode, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { Button, PlugDefault, Text } from '@/shared/ui'
import { ITabConfig, TAB_CONFIG } from '../config/tabs'
import { selectAuthenticatedUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib'
import { useNavigate } from 'react-router'
import { useLogout } from '@/features/authorization'

const PersonalArea: FC = (): ReactNode => {
  const user = useAppSelector(selectAuthenticatedUser)
  const role = user.role
  const navigate = useNavigate()
  const { logout } = useLogout()
  const nav = useNavigate()

  const tabs = useMemo(
    () => TAB_CONFIG.filter((tab) => tab.role === role),
    [role],
  )

  const [currentTab, setCurrentTab] = useState<ITabConfig | null>(
    tabs[0] ?? null,
  )

  const handleTabClick = (tab: ITabConfig) => {
    setCurrentTab(tab)
    if (role === 'student' && tab.name === 'Дашборд') {
      nav('/personal-area/dashboard')
    }
  }

  const ActiveComponent = currentTab?.component

  const getTabColor = (tab: ITabConfig): '--color-primary' | undefined =>
    currentTab?.name === tab.name ? '--color-primary' : undefined

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.leftItems}>
          <Text weight='600' size='20'>
            Личный кабинет
          </Text>
          {tabs.map((tab) => (
            <button
              type='button'
              className={styles.tabButton}
              onClick={() => handleTabClick(tab)}
              key={tab.name}
            >
              <Text color={getTabColor(tab)}>{tab.name}</Text>
            </button>
          ))}
        </div>

        <div className={styles.leftActions}>
          <Button color='secondary' fluid onClick={() => navigate('/')}>
            На главную
          </Button>
          <Button color='inverted' fluid onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>
      <div className={styles.right}>
        {ActiveComponent ? <ActiveComponent /> : <PlugDefault />}
      </div>
    </div>
  )
}

export default PersonalArea
