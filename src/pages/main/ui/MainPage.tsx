import { Button } from '@/shared/ui'
import { ReactNode } from 'react'

const MainPage = (): ReactNode => {
  return <Button onClick={() => console.log('hi')}>Test</Button>
}

export default MainPage
