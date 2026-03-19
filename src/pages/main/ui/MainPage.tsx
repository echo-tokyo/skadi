import { Button } from '@/shared/ui'
import { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router'

const MainPage: FC = (): ReactNode => {
  const nav = useNavigate()
  return <Button onClick={() => nav('/personal-area')}>Войти</Button>
}

export default MainPage
