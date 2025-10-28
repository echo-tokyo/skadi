import { Button, Input } from '@/shared/ui'
import { FC, ReactNode, useState } from 'react'
import { useSignIn } from '@/features/authorization'
import styles from './styles.module.scss'

export const SignIn: FC = (): ReactNode => {
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { signIn, isLoading } = useSignIn()
  const { wrapper, auth } = styles

  return (
    <div className={wrapper}>
      <form action='' className={auth}>
        <Input
          title='test'
          fluid
          placeholder='login'
          value={login}
          onChange={setLogin}
        />
        <Input
          title='test'
          fluid
          placeholder='pass'
          value={password}
          onChange={setPassword}
        />
        <Button fluid onClick={() => signIn({ login, password })}>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </Button>
      </form>
    </div>
  )
}
