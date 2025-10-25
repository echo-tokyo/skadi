import { Button } from '@/shared/ui'
import { FC, ReactNode } from 'react'

const MainPage: FC = (): ReactNode => {
  return <Button onClick={() => console.log('hi')}>Test</Button>
}

export default MainPage
