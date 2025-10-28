import { FC, ReactNode } from 'react'
import styles from './styles.module.scss'

const Header: FC = (): ReactNode => {
  const { logo, avatar, rightItems } = styles

  return (
    <header>
      <div className={logo}></div>
      <div className={rightItems}>
        <div className={avatar}></div>
        <div className={avatar}></div>
      </div>
    </header>
  )
}

export default Header
