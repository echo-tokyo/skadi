import { Button, Input } from '@/shared/ui'
import { ReactNode, useState } from 'react'

const Authorization = (): ReactNode => {
  const [login, setLogin] = useState<string>('')
  const [pass, setPass] = useState<string>('')

  return (
    <form action=''>
      <Input placeholder='login' value={login} onChange={setLogin} />
      <Input placeholder='pass' value={pass} onChange={setPass} />
      <Button onClick={() => console.log('first')}>Войти</Button>
    </form>
  )
}

export default Authorization
