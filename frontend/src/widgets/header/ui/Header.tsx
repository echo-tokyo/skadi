import { FC, ReactNode } from 'react'
import styles from './styles.module.scss'

const Header: FC = (): ReactNode => {
  const { logo, avatar, rightItems } = styles

  return (
    <header>
      <img
        className={logo}
        src='../../../../public/skadi_logo.png'
        height='32'
        alt='IT-Школа "Скади"'
      ></img>
      <div className={rightItems}>
        <div className={avatar}></div>
        <div className={avatar}></div>
      </div>
    </header>
  )
}

export default Header
