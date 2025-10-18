import { Button } from '@/shared/ui'
import { ReactNode } from 'react'

const MainPage = (): ReactNode => {
  return <Button text='test' onClick={() => console.log('hi')} />
}

export default MainPage
