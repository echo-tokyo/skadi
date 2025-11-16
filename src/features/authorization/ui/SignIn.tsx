import { Button, Input } from '@/shared/ui'
import { FC, ReactNode, useState } from 'react'
import styles from './styles.module.scss'
import { useSignIn } from '../lib/use-sign-in'

export const SignIn: FC = (): ReactNode => {
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { wrapper, auth } = styles
  const { signIn } = useSignIn()

  const handleSignInClick = (): void => {
    signIn({ login, password })
  }

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
        <Button fluid onClick={handleSignInClick}>
          Войти
        </Button>
      </form>
    </div>
  )
}
