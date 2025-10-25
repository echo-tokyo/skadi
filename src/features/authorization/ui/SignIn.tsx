import { Button, Input } from '@/shared/ui'
import { FC, ReactNode, useState } from 'react'
import { useSignIn } from '@/features/authorization'

export const SignIn: FC = (): ReactNode => {
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { signIn, isLoading } = useSignIn()

  return (
    <form action=''>
      <Input placeholder='login' value={login} onChange={setLogin} />
      <Input placeholder='pass' value={password} onChange={setPassword} />
      <Button onClick={() => signIn({ login, password })}>
        {isLoading ? 'Загрузка...' : 'Войти'}
      </Button>
    </form>
  )
}
